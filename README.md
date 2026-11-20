# 🤖 AI Research Agent

An AI-powered research assistant built using **React, TypeScript, Python, FastAPI, LangChain, OpenRouter, and Supabase PostgreSQL**.

The application allows users to ask research questions, receive AI-generated research summaries, explore previous conversations, and maintain persistent chat history.

## Key Features

- AI-powered research assistant
- LangChain agent orchestration
- Web search using DuckDuckGo
- OpenRouter LLM integration
- React and TypeScript frontend
- JWT-based user authentication
- Conversation history and persistence
- Supabase PostgreSQL database
- Protected user conversations

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| AI / Agent | LangChain, LangGraph, OpenRouter |
| Search | DuckDuckGo (DDGS) |
| Database | Supabase PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT, Argon2 |

## Project Structure

```text
AI-Research-Agent/
├── Backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Documentation

- Backend setup: `Backend/`
- Frontend setup: `Frontend/`

## Security

Never commit actual environment files, API keys, database passwords, or JWT secrets.