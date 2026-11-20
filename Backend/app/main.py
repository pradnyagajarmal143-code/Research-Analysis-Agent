
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.conversations import router as conversations_router
from app.api.research import router as research_router
from app.api.auth import router as auth_router

from app.database import Base, engine
from app import models


app = FastAPI(
    title="AI Research Agent",
    description="AI-powered research assistant using LangChain and OpenRouter",
    version="1.0.0"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Register API routes
app.include_router(research_router)
app.include_router(auth_router)
app.include_router(conversations_router)


@app.get("/")
def home():
    return {
        "message": "AI Research Agent API is running"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
