<p align="center">
  <img src="docs/screenshots/01-landing-hero.png" alt="EpsteinRAG" width="100%">
</p>

<h1 align="center">EpsteinRAG</h1>

<p align="center">
  <strong>AI-Powered Intelligence Search Engine for Declassified Epstein Documents</strong>
</p>

<p align="center">
  Search and analyze 44,886+ declassified documents released by the U.S. Department of Justice with AI-powered natural language queries. Every answer is backed by source citations from real government documents.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/pgvector-0.3-336791" alt="pgvector">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Status-WIP-yellow" alt="WIP">
</p>

> **🚧 Work In Progress** — This project is still under active development. Features may be incomplete, broken, or change without notice. Contributions and feedback are welcome!

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [License](#license)

---

## Overview

**EpsteinRAG** is a full-stack Retrieval-Augmented Generation (RAG) search engine built to make the 44,886+ declassified Epstein documents from the U.S. Department of Justice searchable and analyzable using AI.

### Key Features

- **Natural Language Search** — Ask questions in plain English like "What financial transfers did Ghislaine Maxwell make?" and get intelligent answers backed by citations
- **AI-Powered Analysis** — Google Gemini 2.5 Flash synthesizes answers from multiple documents with inline source citations
- **Real-Time Streaming** — AI answers stream in real-time via Server-Sent Events (SSE)
- **Hybrid Semantic Search** — Combines keyword and vector search for the most relevant results
- **Advanced Filtering** — Filter by document type, people, locations, aircraft, and evidence type
- **Document Viewer** — Full document content with line numbers, extracted metadata, and link to original DOJ PDF
- **Smart Caching** — Query results cached in PostgreSQL with configurable TTL for sub-20ms repeat queries
- **Google OAuth** — Optional sign-in to save search history
- **44,886+ Documents** — Court records, FBI files, flight logs, emails, financial records, victim statements

---

## Screenshots

### Landing Page

The landing page features a cinematic intelligence-themed design with a typing animation, feature highlights, and an app preview section.

<p align="center">
  <img src="docs/screenshots/01-landing-hero.png" alt="Landing Hero" width="100%">
  <br><em>Hero section with animated typing effect and call-to-action</em>
</p>

<p align="center">
  <img src="docs/screenshots/03-landing-features.png" alt="Features Section" width="100%">
  <br><em>Feature cards showcasing capabilities</em>
</p>

<p align="center">
  <img src="docs/screenshots/04-landing-preview.png" alt="App Preview" width="100%">
  <br><em>Interactive app preview mockup</em>
</p>

### Search Interface

The search page features an advanced filter sidebar, real-time AI analysis with citations, and document result cards.

<p align="center">
  <img src="docs/screenshots/05-search-empty.png" alt="Search Empty State" width="100%">
  <br><em>Search page with filter sidebar (Document Type, People, Locations, Evidence Type)</em>
</p>

<p align="center">
  <img src="docs/screenshots/06-search-results.png" alt="Search Results" width="100%">
  <br><em>Search results with AI Analysis panel, source citations, and performance metrics</em>
</p>

<p align="center">
  <img src="docs/screenshots/07-search-documents.png" alt="Document Cards" width="100%">
  <br><em>Document result cards with metadata tags (people, locations, dataset)</em>
</p>

### Document Detail

Each document page shows the full OCR content with line numbers, extracted metadata, and a link to the original DOJ PDF.

<p align="center">
  <img src="docs/screenshots/08-document-detail.png" alt="Document Detail" width="100%">
  <br><em>Document detail page showing full content, metadata, and original PDF link</em>
</p>

---

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph Client ["Frontend (Next.js 16)"]
        UI[React UI<br/>Tailwind + shadcn/ui]
        NA[NextAuth.js<br/>Google OAuth]
        Hooks[Custom Hooks<br/>useSearch / useStreamingAnswer]
        API_Client[API Client<br/>apiFetch wrapper]
    end

    subgraph Server ["Backend (FastAPI)"]
        Routes[API Routes<br/>search / documents / auth / history]
        MW[Middleware<br/>CORS + GZip + Error Handler]
        SearchSvc[Search Service<br/>RAG Orchestrator]
        AuthSvc[Auth Service<br/>JWT + Google OAuth]
        Repos[Repositories<br/>document / cache / history / user]
    end

    subgraph External ["External Services"]
        Duggan[DugganUSA API<br/>Meilisearch Hybrid Search]
        Gemini_LLM[Gemini 2.5 Flash<br/>LLM Analysis]
        Gemini_Emb[Gemini Embedding 001<br/>3072-dim Vectors]
        Google_Auth[Google OAuth 2.0<br/>Identity Provider]
    end

    subgraph Data ["Data Layer"]
        PG[(PostgreSQL 16<br/>+ pgvector)]
    end

    UI --> Hooks
    Hooks --> API_Client
    NA --> Google_Auth
    API_Client -->|HTTP/SSE| Routes
    Routes --> MW
    Routes --> SearchSvc
    Routes --> AuthSvc
    SearchSvc --> Repos
    SearchSvc --> Duggan
    SearchSvc --> Gemini_LLM
    SearchSvc --> Gemini_Emb
    AuthSvc --> Google_Auth
    Repos --> PG

    style Client fill:#1a1a2e,stroke:#e94560,color:#fff
    style Server fill:#16213e,stroke:#0f3460,color:#fff
    style External fill:#0f3460,stroke:#533483,color:#fff
    style Data fill:#1a1a2e,stroke:#e94560,color:#fff
```

### Database Schema

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string name
        string google_id UK
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    DOCUMENTS {
        string id PK
        string efta_id
        text content
        string content_preview
        string doc_type
        string[] people
        string[] locations
        string[] aircraft
        string[] evidence_types
        int pages
        string source
        string dataset
        string file_path
        vector(3072) embedding
        timestamp created_at
    }

    SEARCH_HISTORY {
        uuid id PK
        uuid user_id FK
        string query
        jsonb filters
        int result_count
        timestamp created_at
    }

    QUERY_CACHE {
        string cache_key PK
        jsonb result
        timestamp created_at
        timestamp expires_at
    }

    USERS ||--o{ SEARCH_HISTORY : "has"
```

---

## How It Works

### Search Flow

This is the complete flow from when a user types a query to when they see the AI-generated answer with citations:

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Frontend
    participant Backend as FastAPI Backend
    participant Cache as PostgreSQL Cache
    participant Duggan as DugganUSA API
    participant Gemini as Gemini 2.5 Flash

    User->>Frontend: Types search query<br/>"Ghislaine Maxwell financial transfers"
    Frontend->>Backend: POST /api/search<br/>{query, filters, limit}

    Backend->>Cache: Check query cache<br/>(SHA-256 hash key)

    alt Cache Hit (< TTL)
        Cache-->>Backend: Return cached SearchResult
        Backend-->>Frontend: 200 OK (cached: true, ~16ms)
    else Cache Miss
        Backend->>Duggan: POST /api/v1/search<br/>{q, filter, limit, semanticRatio: 0.5}
        Duggan-->>Backend: Matched documents<br/>(hybrid keyword + semantic)

        Backend->>Gemini: Generate AI analysis<br/>(query + top 5 doc contexts)
        Gemini-->>Backend: AI answer with citations

        Backend->>Cache: Store result (TTL: 1 hour)
        Backend-->>Frontend: 200 OK (cached: false, ~9s)
    end

    Frontend-->>User: Display AI Analysis +<br/>Source Documents + Citations
```

### Streaming Flow (Real-Time AI Answers)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Frontend
    participant Backend as FastAPI Backend
    participant Duggan as DugganUSA API
    participant Gemini as Gemini 2.5 Flash

    User->>Frontend: Clicks search
    Frontend->>Backend: GET /api/search/stream?q=...
    Note over Backend: SSE Connection Opened

    Backend->>Duggan: Fetch documents
    Duggan-->>Backend: Documents returned

    Backend->>Gemini: Stream LLM response
    loop Token by Token
        Gemini-->>Backend: Answer chunk
        Backend-->>Frontend: SSE event: {"type":"chunk","data":"..."}
    end

    Backend-->>Frontend: SSE event: {"type":"citations","data":[...]}
    Backend-->>Frontend: SSE event: {"type":"documents","data":[...]}
    Backend-->>Frontend: SSE event: {"type":"done"}

    Frontend-->>User: Real-time streaming answer<br/>with progressive rendering
```

### Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Frontend
    participant NextAuth as NextAuth.js
    participant Google as Google OAuth 2.0
    participant Backend as FastAPI Backend
    participant DB as PostgreSQL

    User->>Frontend: Clicks "Sign In"
    Frontend->>NextAuth: Initiate OAuth flow
    NextAuth->>Google: Redirect to Google consent
    Google-->>User: Show consent screen
    User->>Google: Approve access
    Google-->>NextAuth: Authorization code
    NextAuth->>Google: Exchange for tokens
    Google-->>NextAuth: {id_token, access_token}
    NextAuth-->>Frontend: Session with id_token

    Frontend->>Backend: POST /api/auth/google<br/>{id_token}
    Backend->>Google: Verify id_token
    Google-->>Backend: User info (email, name, avatar)
    Backend->>DB: Upsert user record
    DB-->>Backend: User entity
    Backend-->>Frontend: {access_token: JWT, user: {...}}

    Frontend->>Frontend: Store JWT in localStorage
    Note over Frontend: All subsequent API calls<br/>include Authorization: Bearer JWT
```

### Data Ingestion Flow

```mermaid
flowchart LR
    A[DugganUSA API<br/>44,886 documents] -->|HTTP fetch<br/>limit=1000| B[Ingestion Script<br/>ingest_documents.py]
    B -->|Batch embed<br/>100 req/min| C[Gemini Embedding API<br/>3072-dim vectors]
    B -->|Store| D[(PostgreSQL<br/>+ pgvector)]
    C -->|Embeddings| D

    style A fill:#533483,stroke:#e94560,color:#fff
    style B fill:#16213e,stroke:#0f3460,color:#fff
    style C fill:#0f3460,stroke:#533483,color:#fff
    style D fill:#1a1a2e,stroke:#e94560,color:#fff
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Python 3.12+** | Runtime |
| **FastAPI 0.115** | Async web framework |
| **PostgreSQL 16** | Primary database |
| **pgvector** | Vector similarity search extension |
| **SQLAlchemy 2.0** | Async ORM with asyncpg driver |
| **Google Gemini 2.5 Flash** | LLM for AI analysis |
| **Gemini Embedding 001** | 3072-dimensional embeddings |
| **Pydantic v2** | Data validation and serialization |
| **structlog** | Structured logging |
| **tenacity** | Retry logic for external APIs |
| **python-jose** | JWT token handling |

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16.1** | React framework with Turbopack |
| **React 19** | UI library |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **NextAuth.js 4** | Authentication (Google OAuth) |
| **Zustand** | Lightweight state management |
| **SWR** | Data fetching and caching |
| **Lucide React** | Icon library |
| **react-markdown** | Markdown rendering for AI responses |

### Infrastructure

| Technology | Purpose |
|---|---|
| **Docker** | PostgreSQL containerization |
| **pgvector/pgvector:pg16** | Pre-built PostgreSQL + pgvector image |

---

## Project Structure

```
EpsteinRAG/
├── backend/
│   ├── app/
│   │   ├── config.py                    # App settings (Pydantic BaseSettings)
│   │   ├── main.py                      # FastAPI app entry point
│   │   ├── api/
│   │   │   ├── dependencies.py          # Dependency injection
│   │   │   ├── middleware/
│   │   │   │   └── error_handler.py     # Global exception handlers
│   │   │   ├── routes/
│   │   │   │   ├── auth.py              # Google OAuth endpoints
│   │   │   │   ├── documents.py         # Document retrieval & metadata
│   │   │   │   ├── health.py            # Health check endpoint
│   │   │   │   ├── history.py           # Search history CRUD
│   │   │   │   └── search.py            # Search & SSE streaming
│   │   │   └── schemas/
│   │   │       ├── auth_schemas.py      # Auth request/response models
│   │   │       ├── history_schemas.py   # History response models
│   │   │       └── search_schemas.py    # Search request/response models
│   │   ├── core/
│   │   │   ├── auth_service.py          # JWT creation & validation
│   │   │   └── search_service.py        # RAG orchestration logic
│   │   ├── domain/
│   │   │   └── entities.py              # Domain models (User, Document, etc.)
│   │   ├── infrastructure/
│   │   │   ├── database.py              # Async SQLAlchemy + pgvector setup
│   │   │   ├── external/
│   │   │   │   ├── duggan_client.py     # DugganUSA API client
│   │   │   │   ├── gemini_client.py     # Gemini LLM & embedding client
│   │   │   │   └── google_oauth.py      # Google token verification
│   │   │   └── repositories/
│   │   │       ├── cache_repo.py        # Query cache repository
│   │   │       ├── document_repo.py     # Document + vector search repo
│   │   │       ├── history_repo.py      # Search history repository
│   │   │       └── user_repo.py         # User repository
│   │   ├── scripts/
│   │   │   └── ingest_documents.py      # Data ingestion pipeline
│   │   └── utils/
│   │       ├── exceptions.py            # Custom exception classes
│   │       └── logger.py                # Structlog configuration
│   ├── tests/
│   │   ├── unit/                        # 22 unit tests
│   │   └── integration/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout with metadata
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── search/page.tsx          # Search interface
│   │   │   ├── documents/[id]/page.tsx  # Document detail page
│   │   │   └── api/auth/[...nextauth]/  # NextAuth API route
│   │   ├── components/
│   │   │   ├── landing/                 # Hero, Features, AppPreview, CTA
│   │   │   ├── search/                  # SearchBar, AIAnswer, DocumentCard, Filters
│   │   │   ├── document/               # DocumentContent, Header, Metadata
│   │   │   ├── layout/                 # Header, Footer
│   │   │   ├── auth/                   # LoginButton
│   │   │   └── ui/                     # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── api/                    # API client functions
│   │   │   ├── hooks/                  # useSearch, useFilters, useStreamingAnswer
│   │   │   └── types/                  # TypeScript interfaces
│   │   └── config/site.ts             # Site configuration
│   └── package.json
│
├── docker/
│   └── docker-compose.yml              # PostgreSQL + pgvector
│
└── docs/
    └── screenshots/                    # App screenshots
```

---

## Getting Started

### Prerequisites

- **Node.js 20+** and **npm**
- **Python 3.12+**
- **Docker** (for PostgreSQL)
- **Google Cloud Console** project (for OAuth + Gemini API key)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/EpsteinRAG.git
cd EpsteinRAG
```

### 2. Start the Database

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts PostgreSQL 16 with pgvector on port **5433**.

### 3. Set Up the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials (see Configuration section)

# Start the backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start the frontend
npm run dev
```

### 5. Open the App

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/api/docs
- **Backend ReDoc**: http://localhost:8000/api/redoc

---

## Configuration

### Backend Environment Variables (`.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres@localhost:5433/epstein_rag` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | (required) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | (required) |
| `GEMINI_API_KEY` | Google Gemini API key | (required) |
| `JWT_SECRET_KEY` | Secret for JWT signing | `change-this-secret` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiry in minutes | `60` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:3000"]` |
| `DUGGAN_API_BASE_URL` | DugganUSA API base URL | `https://analytics.dugganusa.com/api/v1` |
| `VECTOR_DIMENSIONS` | Embedding vector dimensions | `3072` |
| `DEFAULT_SEARCH_LIMIT` | Default results per search | `20` |
| `QUERY_CACHE_TTL_SECONDS` | Cache TTL in seconds | `3600` |

### Frontend Environment Variables (`.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000/api` |
| `NEXTAUTH_URL` | NextAuth callback URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | (required) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | (required) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | (required) |

---

## API Reference

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check + database status |

### Search

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/search` | Full search with AI analysis |
| `GET` | `/api/search/stream` | SSE streaming search results |

**POST `/api/search`** — Request body:
```json
{
  "query": "Ghislaine Maxwell financial transfers",
  "filters": {
    "doc_type": ["financial"],
    "people": ["maxwell"]
  },
  "limit": 20
}
```

**Response:**
```json
{
  "query": "Ghislaine Maxwell financial transfers",
  "answer": "Based on the provided documents...",
  "citations": [
    { "document_id": "dataset9-EFTA00015176", "efta_id": "EFTA00015176", "snippet": "..." }
  ],
  "documents": [ ... ],
  "total_results": 20,
  "search_time_ms": 189,
  "cached": true
}
```

### Documents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents/{id}` | Full document detail |
| `GET` | `/api/documents/{id}/related` | Related documents (vector similarity) |
| `GET` | `/api/documents/` | Filter metadata (available types, people, etc.) |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/google` | Exchange Google id_token for JWT |
| `GET` | `/api/auth/me` | Get current user profile |

### History (Requires Auth)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/history/` | List search history |
| `DELETE` | `/api/history/{id}` | Delete history entry |
| `DELETE` | `/api/history/` | Clear all history |

---

## Testing

### Backend Unit Tests

```bash
cd backend
pytest tests/ -v
```

All **22 unit tests** passing:
- Config and settings tests
- Domain entity validation tests
- Repository tests (document, cache, history, user)
- Service layer tests (search, auth)
- API route tests (health, search, documents, history)
- Exception handling tests

### Manual Testing

```bash
# Health check
curl http://localhost:8000/api/health

# Search
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Jeffrey Epstein flight logs", "limit": 5}'

# SSE Streaming
curl "http://localhost:8000/api/search/stream?q=Ghislaine+Maxwell"

# Document detail
curl http://localhost:8000/api/documents/dataset9-EFTA00015176
```

---

## Data Source

All documents are sourced from the **U.S. Department of Justice** Epstein document releases:

- **Official DOJ Library**: https://www.justice.gov/epstein
- **Total Documents**: 44,886+
- **Document Types**: Court records, FBI files, flight logs, emails, financial records, victim statements, correspondence, law enforcement reports
- **Data API**: DugganUSA Analytics API (Meilisearch-backed hybrid semantic search)

> All documents are public domain materials released under FOIA. This tool is for research and journalistic purposes only.

---

## Performance

| Metric | Value |
|---|---|
| Cached search response | ~16ms |
| Fresh search (API + AI) | ~8-10s |
| SSE first token | ~2-3s |
| Frontend cold start | ~1.5s |
| Frontend warm navigation | ~80ms |
| Database documents | 44,886+ |
| Embedding dimensions | 3,072 |

---

## Disclaimer

> **This is a personal hobby project (proyek iseng) built purely for learning and portfolio purposes.**
>
> - This project **may contain bugs, inaccuracies, or errors** — it is not production-grade software and should not be treated as a reliable source of truth.
> - This project is **NOT intended to defame, incriminate, or harm any individual** mentioned in the documents. All documents are publicly available government records released under FOIA by the U.S. Department of Justice.
> - This project is **NOT affiliated with any government agency, organization, political entity, or individual**. It is an independent, open-source project built by a solo developer.
> - The AI-generated analyses may produce **hallucinations or incorrect interpretations** of document contents. Always verify information against the original source documents on the [DOJ website](https://www.justice.gov/epstein).
> - **Everything is open source.** The full source code is publicly available for review, audit, and contribution.
>
> Use at your own discretion. The developer assumes no liability for how this tool or its outputs are used.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

