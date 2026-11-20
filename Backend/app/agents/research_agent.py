
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent

from app.core.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    MODEL_NAME
)

from app.tools.search_tool import search_tool
from app.prompts.research_prompt import SYSTEM_PROMPT
from app.schemas.research import ResearchResponse


# Initialize LLM
llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL
)


# Create research agent
research_agent = create_agent(
    model=llm,
    tools=[search_tool],
    system_prompt=SYSTEM_PROMPT,
    response_format=ResearchResponse
)
