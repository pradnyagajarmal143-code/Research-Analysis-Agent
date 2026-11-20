
from fastapi import APIRouter, HTTPException

from app.schemas.research import (
    ResearchRequest,
    ResearchResponse
)

from app.services.research_service import generate_research


router = APIRouter(
    prefix="/api/v1",
    tags=["Research"]
)


@router.post(
    "/research",
    response_model=ResearchResponse
)
def research(request: ResearchRequest):

    try:
        result = generate_research(request.query)
        return result

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Research failed: {str(error)}"
        )
