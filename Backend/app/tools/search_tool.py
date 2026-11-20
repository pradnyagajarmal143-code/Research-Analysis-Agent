
from ddgs import DDGS
from langchain_core.tools import tool


@tool
def search_tool(query: str) -> str:
    """Search the internet for research information."""

    try:
        with DDGS() as ddgs:
            results = list(
                ddgs.text(
                    query,
                    backend="duckduckgo",
                    max_results=5
                )
            )

        if not results:
            return "No search results found."

        formatted_results = []

        for item in results:
            formatted_results.append(
                f"""
                Title: {item.get('title', '')}
                URL: {item.get('href', '')}
                Description: {item.get('body', '')}
                """
            )

        return "\n".join(formatted_results)

    except Exception as error:
        raise RuntimeError(f"Search failed: {error}") from error
