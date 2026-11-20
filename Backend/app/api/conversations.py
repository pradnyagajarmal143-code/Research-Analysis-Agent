
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse
)
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/api/v1/conversations",
    tags=["Conversations"]
)


def get_user_conversation(
    conversation_id: int,
    user_id: int,
    db: Session
):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == user_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    return conversation


@router.post(
    "",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_conversation(
    request: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = Conversation(
        user_id=current_user.id,
        title=request.title
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


@router.get("", response_model=list[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(desc(Conversation.updated_at))
        .all()
    )


@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse]
)
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_user_conversation(
        conversation_id,
        current_user.id,
        db
    )

    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc(), Message.id.asc())
        .all()
    )


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED
)
def save_message(
    conversation_id: int,
    request: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = get_user_conversation(
        conversation_id,
        current_user.id,
        db
    )

    if request.role not in ("user", "assistant"):
        raise HTTPException(
            status_code=400,
            detail="Invalid message role"
        )

    message = Message(
        conversation_id=conversation_id,
        role=request.role,
        content=request.content
    )

    db.add(message)

    if request.role == "user" and conversation.title == "New Research":
        conversation.title = request.content[:60]

    conversation.updated_at = func.now()
    db.commit()
    db.refresh(message)

    return message
