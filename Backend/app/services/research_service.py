from langchain_openai import ChatOpenAI

from app.core.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    MODEL_NAME
)

from app.agents.research_agent import research_agent
from app.schemas.research import ResearchResponse


# Reuse existing OpenRouter configuration
chat_llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
    temperature=0.3
)


def generate_chat_response(query: str) -> ResearchResponse:

    response = chat_llm.invoke(query)

    return ResearchResponse(
        topic="General Conversation",
        summary=response.content,
        sources=[],
        tools_used=[]
    )


def generate_research(query: str) -> ResearchResponse:

    query_lower = query.strip().lower()

    greetings = [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "thanks",
        "thank you"
    ]

    if query_lower in greetings:
        return ResearchResponse(
            topic="General Conversation",
            summary="Hello! How can I help you today?",
            sources=[],
            tools_used=[]
        )

    result = research_agent.invoke({
        "messages": [
            {"role": "user", "content": query}
        ]
    })

    print("Agent result:", result)

    structured_response = result.get("structured_response")

    if structured_response is not None:
        return structured_response

    # Fallback for general conversational questions
    return generate_chat_response(query)