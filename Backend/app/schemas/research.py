from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)


class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str] = Field(default_factory=list)
    tools_used: list[str] = Field(default_factory=list)