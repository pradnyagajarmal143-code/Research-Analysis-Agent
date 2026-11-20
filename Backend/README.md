# AI Research Agent – Backend

FastAPI backend for the AI Research Agent application. It provides AI-powered research, user authentication, and persistent conversation history.

## Tech Stack

- **Python** – Backend programming language
- **FastAPI** – REST API framework
- **LangChain** – AI agent orchestration
- **OpenRouter** – LLM API integration
- **Supabase PostgreSQL** – Database
- **SQLAlchemy** – ORM
- **JWT** – Authentication
- **Argon2** – Password hashing

## Project Structure

```text
Backend/
├── app/
│   ├── agents/
│   │   └── research_agent.py
│   ├── api/
│   │   ├── auth.py
│   │   ├── conversations.py
│   │   └── research.py
│   ├── core/
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   └── security.py
│   ├── models/
│   │   ├── user.py
│   │   ├── conversation.py
│   │   └── message.py
│   ├── prompts/
    │   └── research_prompt.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── conversation.py
│   │   └── research.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── research_service.py
│   ├── tools/
    │   └── search_tool.py
│   ├── database.py
│   └── main.py
├── .env.example
├── .gitignore
└── requirements.txt
```

## Prerequisites

- Python 3.10+
- pip
- Supabase PostgreSQL database
- OpenRouter API key

## Setup Instructions

### 1. Navigate to the Backend folder

```powershell
cd Backend
```

### 2. Create a virtual environment

```powershell
python -m venv venv
```

### 3. Activate the virtual environment

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```powershell
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file inside the `Backend` directory.

Use `.env.example` as a reference:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
MODEL_NAME=openrouter/free

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET_KEY=your_generated_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Important:** Never commit your `.env` file or expose API keys, database credentials, or JWT secrets.

## Run the Backend

Run the following command from the `Backend` directory:

```powershell
python -m uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### API Documentation

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

Alternative API documentation:

```text
http://127.0.0.1:8000/redoc
```

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| POST | `/research` | Generate AI-powered research |
| POST | `/conversations` | Create a conversation |
| GET | `/conversations` | Get the logged-in user's conversations |
| GET | `/conversations/{conversation_id}/messages` | Retrieve conversation messages |
| POST | `/conversations/{conversation_id}/messages` | Save a conversation message |

Protected endpoints require a valid JWT access token in the Authorization header:

```text
Authorization: Bearer <access_token>
```

Check the router definitions in `app/api/` for the exact registered paths and request/response schemas.

## Database

The application uses Supabase PostgreSQL with SQLAlchemy.

Main database tables:

- `users` – Stores user account details and password hashes.
- `conversations` – Stores conversation metadata and ownership.
- `messages` – Stores user and assistant messages.

Database models are located in `app/models/`.

## Authentication

The backend uses JWT-based authentication.

- User passwords are hashed using Argon2.
- Successful login returns an access token.
- Protected endpoints validate the token and identify the current user.
- Conversation records are scoped to their owner.

## Development Notes

- Keep secrets in `.env`.
- Update `requirements.txt` when dependencies change.
- Run the backend from the `Backend` directory.
- Use Swagger UI to test endpoints during development.

## Future Improvements

- Add Alembic database migrations.
- Add automated API and integration tests.
- Improve error handling and request validation.
- Add refresh-token support and stronger production session management.
- Add structured logging and monitoring.
