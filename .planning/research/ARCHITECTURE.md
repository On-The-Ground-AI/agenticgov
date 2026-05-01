# Architecture Research

**Domain:** AI-Powered Impact Evaluation Tool with RAG
**Researched:** 2026-01-28
**Confidence:** MEDIUM-HIGH

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER (React + TS)                         │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Wizard    │  │  Dashboard  │  │   Report    │  │   Quality   │       │
│  │  Components │  │     UI      │  │   Viewer    │  │   Scorer    │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │                │              │
│         └────────────────┴────────────────┴────────────────┘              │
│                                   │                                        │
│                            State Management                                │
│                         (Zustand/React Query)                              │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │ REST API / WebSocket
                                    │ (Type-safe with tRPC or OpenAPI)
┌───────────────────────────────────┴────────────────────────────────────────┐
│                       BACKEND API LAYER (FastAPI)                           │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Wizard    │  │   Query     │  │   Report    │  │   Quality   │       │
│  │  Endpoints  │  │  Handler    │  │  Generator  │  │  Evaluator  │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │                │              │
├─────────┴────────────────┴────────────────┴────────────────┴───────────────┤
│                          RAG ORCHESTRATION LAYER                            │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        RAG Engine (LangChain)                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Query    │  │ Retrieval  │  │  Rerank    │  │ Generation │    │  │
│  │  │ Expansion  │  │  Service   │  │  Service   │  │  Service   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────┤
│                        DATA PROCESSING LAYER                                │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│  │  Document   │  │   Chunking  │  │  Embedding  │                        │
│  │   Loader    │  │   Service   │  │   Service   │                        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                        │
└─────────┴────────────────┴────────────────┴────────────────────────────────┘
          │                │                │
          └────────────────┴────────────────┘
                          │
┌─────────────────────────┴──────────────────────────────────────────────────┐
│                    STORAGE LAYER (PostgreSQL + pgvector)                    │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Relational  │  │    Vector    │  │    User      │  │   Session    │  │
│  │     Data     │  │  Embeddings  │  │    Data      │  │     Data     │  │
│  │  (Methods,   │  │  (110K word  │  │  (Projects,  │  │  (Wizard     │  │
│  │  Criteria)   │  │     KB)      │  │   Reports)   │  │   State)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                          │
                    Claude API
                 (External Service)
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation | Build Priority |
|-----------|----------------|------------------------|----------------|
| **Frontend Wizard** | Multi-step form orchestration, local state management | React Hook Form + Zustand, TypeScript types for each step | Phase 1 (Core) |
| **Frontend Dashboard** | Project list, navigation, user context | React components with React Query for server state | Phase 1 (Core) |
| **Backend API Layer** | Request validation, authentication, rate limiting, routing | FastAPI with Pydantic models, async endpoints | Phase 1 (Core) |
| **RAG Engine** | Query understanding, retrieval orchestration, context assembly | LangChain with custom chains, prompt templates | Phase 2 (Intelligence) |
| **Document Loader** | Parse 110K knowledge base, handle multiple formats | LangChain document loaders, custom parsers | Phase 2 (Intelligence) |
| **Chunking Service** | Split documents into semantically meaningful segments | Semantic chunking with 500-1000 token chunks, 100 token overlap | Phase 2 (Intelligence) |
| **Embedding Service** | Convert text to vector embeddings | OpenAI embeddings or Claude embeddings API | Phase 2 (Intelligence) |
| **Retrieval Service** | Hybrid search (semantic + keyword), retrieve top-k chunks | pgvector cosine similarity + PostgreSQL full-text search | Phase 2 (Intelligence) |
| **Rerank Service** | Re-score retrieved chunks for relevance | Cross-encoder model or LLM-based reranking | Phase 3 (Optimization) |
| **Generation Service** | Prompt assembly, LLM invocation, streaming responses | Claude API with structured prompts | Phase 2 (Intelligence) |
| **Quality Evaluator** | Score evaluation design against best practices | Rule-based + LLM-based scoring with criteria from KB | Phase 2 (Intelligence) |
| **Report Generator** | Format recommendations into structured reports | Template-based with dynamic content injection | Phase 3 (Polish) |
| **Vector Store** | Persist and query embeddings | PostgreSQL with pgvector extension | Phase 2 (Intelligence) |
| **Session Manager** | Persist wizard state, enable resume | PostgreSQL with JSON columns for wizard state | Phase 1 (Core) |

## Recommended Project Structure

### Backend (Python/FastAPI)

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── wizard.py       # Wizard flow endpoints
│   │   │   │   ├── recommendations.py  # Method recommendations
│   │   │   │   ├── quality.py      # Quality scoring
│   │   │   │   └── reports.py      # Report generation
│   │   │   └── api.py              # API router aggregation
│   │   └── deps.py                 # Dependency injection
│   ├── core/
│   │   ├── config.py               # Configuration management
│   │   ├── security.py             # Auth, rate limiting
│   │   └── logging.py              # Structured logging
│   ├── rag/
│   │   ├── engine.py               # RAG orchestration
│   │   ├── retrieval.py            # Retrieval service
│   │   ├── generation.py           # LLM generation
│   │   ├── chunking.py             # Document chunking
│   │   ├── embeddings.py           # Embedding service
│   │   └── rerank.py               # Reranking logic
│   ├── services/
│   │   ├── wizard.py               # Business logic for wizard
│   │   ├── quality_evaluator.py   # Evaluation scoring
│   │   └── report_generator.py    # Report creation
│   ├── models/
│   │   ├── domain.py               # Domain models (Projects, Evaluations)
│   │   ├── wizard.py               # Wizard state models
│   │   └── rag.py                  # RAG-specific models
│   ├── db/
│   │   ├── session.py              # Database session management
│   │   ├── repositories/           # Data access layer
│   │   └── migrations/             # Alembic migrations
│   └── main.py                     # FastAPI application entry
├── scripts/
│   ├── ingest_knowledge_base.py   # One-time KB ingestion
│   └── update_embeddings.py       # Update vectors when KB changes
├── tests/
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── conftest.py                 # Pytest configuration
├── pyproject.toml                  # Python dependencies
└── alembic.ini                     # Database migrations config
```

### Frontend (React/TypeScript)

```
frontend/
├── src/
│   ├── features/
│   │   ├── wizard/
│   │   │   ├── components/         # Step components
│   │   │   ├── hooks/              # useWizard, useWizardState
│   │   │   ├── stores/             # Zustand wizard store
│   │   │   ├── types.ts            # TypeScript types for wizard
│   │   │   └── index.ts            # Public API
│   │   ├── recommendations/
│   │   │   ├── components/         # Method cards, comparison
│   │   │   ├── hooks/              # useRecommendations
│   │   │   └── types.ts
│   │   ├── quality/
│   │   │   ├── components/         # Score displays, criteria
│   │   │   └── types.ts
│   │   └── reports/
│   │       ├── components/         # Report viewer, export
│   │       └── types.ts
│   ├── shared/
│   │   ├── api/
│   │   │   ├── client.ts           # API client (React Query)
│   │   │   └── endpoints/          # Type-safe API calls
│   │   ├── components/             # Reusable UI components
│   │   ├── hooks/                  # Shared hooks
│   │   ├── types/                  # Shared TypeScript types
│   │   └── utils/                  # Helper functions
│   ├── layouts/                    # Page layouts
│   ├── pages/                      # Route components
│   ├── App.tsx                     # App root
│   └── main.tsx                    # Entry point
├── package.json
└── tsconfig.json
```

### Structure Rationale

- **Backend: Feature-based organization** - `/api/endpoints/` groups endpoints by feature, `/services/` contains business logic separate from HTTP concerns, `/rag/` isolates RAG complexity in dedicated module
- **Backend: Clear layer separation** - API layer (validation, serialization) → Service layer (business logic) → Repository layer (data access) → RAG layer (retrieval intelligence)
- **Frontend: Feature folders** - Each major feature (wizard, recommendations, quality, reports) is self-contained with its own components, hooks, stores, and types
- **Frontend: Shared infrastructure** - API client, reusable components, and utilities prevent duplication
- **Separation of ingestion and query** - Knowledge base ingestion is offline (scripts), query/retrieval is online (API)

## Architectural Patterns

### Pattern 1: Modular RAG Pipeline

**What:** Separate retrieval, reranking, and generation into distinct, swappable components.

**When to use:** Always in production RAG systems. Enables independent optimization of each stage.

**Trade-offs:**
- **Pros:** Can upgrade embedding model without changing generation, can add reranking without touching retrieval, easier to test and debug each stage
- **Cons:** More components to maintain, slightly higher latency due to stage transitions

**Example:**
```typescript
// Backend (Python/FastAPI)
class RAGEngine:
    def __init__(
        self,
        retriever: RetrieverProtocol,
        reranker: Optional[RerankerProtocol],
        generator: GeneratorProtocol
    ):
        self.retriever = retriever
        self.reranker = reranker
        self.generator = generator

    async def query(self, query: str, context: dict) -> RAGResponse:
        # Stage 1: Retrieval
        chunks = await self.retriever.retrieve(query, top_k=20)

        # Stage 2: Reranking (optional)
        if self.reranker:
            chunks = await self.reranker.rerank(query, chunks, top_k=5)

        # Stage 3: Generation
        response = await self.generator.generate(
            query=query,
            context=chunks,
            metadata=context
        )

        return response
```

**Build order:** Retrieval → Generation → Reranking (add reranking last, it's optimization)

### Pattern 2: Hybrid Retrieval (Semantic + Keyword)

**What:** Combine pgvector cosine similarity (semantic) with PostgreSQL full-text search (keyword) for better recall.

**When to use:** When knowledge base contains domain-specific terminology that embedding models might not capture well.

**Trade-offs:**
- **Pros:** Better recall for exact terms (e.g., "RCT", "quasi-experimental"), captures both meaning and specific keywords
- **Cons:** Requires tuning weights between semantic and keyword scores, more complex ranking logic

**Example:**
```python
# Backend retrieval service
class HybridRetriever:
    async def retrieve(self, query: str, top_k: int = 20) -> list[Chunk]:
        # Semantic search with pgvector
        query_embedding = await self.embedding_service.embed(query)
        semantic_results = await self.db.execute(
            """
            SELECT id, content,
                   1 - (embedding <=> :query_embedding) as semantic_score
            FROM knowledge_chunks
            ORDER BY embedding <=> :query_embedding
            LIMIT :limit
            """,
            {"query_embedding": query_embedding, "limit": top_k}
        )

        # Keyword search with PostgreSQL full-text search
        keyword_results = await self.db.execute(
            """
            SELECT id, content,
                   ts_rank(search_vector, plainto_tsquery(:query)) as keyword_score
            FROM knowledge_chunks
            WHERE search_vector @@ plainto_tsquery(:query)
            ORDER BY keyword_score DESC
            LIMIT :limit
            """,
            {"query": query, "limit": top_k}
        )

        # Combine with reciprocal rank fusion
        return self._fuse_results(semantic_results, keyword_results, top_k)
```

**Build order:** Start with semantic only, add keyword search in optimization phase

### Pattern 3: Wizard State Persistence with Resume Capability

**What:** Store wizard state in database to enable multi-session completion, with frontend hydration on resume.

**When to use:** Always for government users who may need to pause and resume evaluations over days/weeks.

**Trade-offs:**
- **Pros:** Users never lose work, can collaborate (share session), audit trail for compliance
- **Cons:** Additional complexity in state synchronization, need to handle stale sessions

**Example:**
```typescript
// Frontend Zustand store
interface WizardStore {
  currentStep: number;
  formData: WizardFormData;
  sessionId: string | null;

  // Auto-save on every change
  setFormData: (step: number, data: Partial<WizardFormData>) => void;

  // Load existing session
  resumeSession: (sessionId: string) => Promise<void>;
}

const useWizardStore = create<WizardStore>((set, get) => ({
  currentStep: 0,
  formData: {},
  sessionId: null,

  setFormData: async (step, data) => {
    const newFormData = { ...get().formData, [step]: data };
    set({ formData: newFormData });

    // Auto-save to backend
    await apiClient.saveWizardState({
      sessionId: get().sessionId,
      step,
      data: newFormData
    });
  },

  resumeSession: async (sessionId) => {
    const session = await apiClient.getWizardSession(sessionId);
    set({
      sessionId,
      currentStep: session.currentStep,
      formData: session.formData
    });
  }
}));
```

```python
# Backend session model
class WizardSession(Base):
    __tablename__ = "wizard_sessions"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("users.id"))
    current_step = Column(Integer, default=0)
    form_data = Column(JSONB)  # PostgreSQL JSONB for wizard state
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
```

**Build order:** Phase 1 - basic wizard flow must include session persistence from the start

### Pattern 4: Streaming LLM Responses

**What:** Stream Claude API responses back to frontend for better perceived performance, especially for long method recommendations.

**When to use:** Any LLM interaction longer than 2-3 seconds of generation time.

**Trade-offs:**
- **Pros:** Users see progress immediately, better UX for long responses, can stop generation early
- **Cons:** More complex error handling, need WebSocket or SSE support

**Example:**
```python
# Backend streaming endpoint
from fastapi.responses import StreamingResponse

@router.post("/recommendations/stream")
async def stream_recommendations(request: RecommendationRequest):
    async def generate():
        rag_context = await rag_engine.retrieve(request.query)

        async for chunk in claude_client.stream_completion(
            prompt=build_prompt(request, rag_context),
            max_tokens=2000
        ):
            yield f"data: {json.dumps({'content': chunk})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
```

```typescript
// Frontend consumption
const useStreamingRecommendation = (query: string) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetch = async () => {
    setIsLoading(true);
    const response = await apiClient.streamRecommendations(query);
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const data = JSON.parse(chunk.replace('data: ', ''));
      setContent(prev => prev + data.content);
    }

    setIsLoading(false);
  };

  return { content, isLoading, fetch };
};
```

**Build order:** Phase 2 - add after basic request/response works, not MVP critical

### Pattern 5: Semantic Chunking for Impact Evaluation Knowledge

**What:** Use semantic chunking rather than fixed-size chunking to preserve methodological concepts intact.

**When to use:** Domain knowledge with logical sections (methods, criteria, guidelines). Impact evaluation fits perfectly.

**Trade-offs:**
- **Pros:** Chunks respect semantic boundaries, retrieval returns complete concepts, better context for LLM
- **Cons:** Chunks vary in size, potentially more expensive embeddings, requires initial tuning

**Example:**
```python
# Backend chunking service
from langchain.text_splitter import RecursiveCharacterTextSplitter

class SemanticChunker:
    def __init__(self):
        # Hierarchical separators that respect document structure
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,  # tokens, not characters
            chunk_overlap=100,
            separators=[
                "\n\n## ",      # Major sections
                "\n\n### ",     # Subsections
                "\n\n",         # Paragraphs
                "\n",           # Lines
                ". ",           # Sentences
                " ",            # Words
            ],
            length_function=self._token_length,
        )

    def chunk_document(self, doc: Document) -> list[Chunk]:
        chunks = self.splitter.split_text(doc.content)

        return [
            Chunk(
                content=chunk,
                metadata={
                    **doc.metadata,
                    "chunk_index": i,
                    "source_doc_id": doc.id
                }
            )
            for i, chunk in enumerate(chunks)
        ]
```

**Build order:** Phase 2 - during knowledge base ingestion, critical for quality

## Data Flow

### Request Flow: Method Recommendation Query

```
[User submits wizard form]
         ↓
[Frontend Wizard]
    - Validates form data (React Hook Form + Zod)
    - Sends to backend via React Query
         ↓
[Backend API Endpoint: POST /api/v1/recommendations]
    - Validates request (Pydantic)
    - Extracts context (project type, budget, timeline, objectives)
         ↓
[RAG Engine: query()]
    - Formats query for retrieval
    - Calls Retrieval Service
         ↓
[Retrieval Service]
    - Embeds query → vector
    - Queries pgvector (semantic) + full-text (keyword)
    - Returns top 20 chunks
         ↓
[Rerank Service] (Optional, Phase 3)
    - Re-scores 20 chunks against query
    - Returns top 5 most relevant
         ↓
[Generation Service]
    - Assembles prompt: system prompt + RAG context + user query
    - Calls Claude API with context
    - Formats response with method recommendations
         ↓
[Backend API Response]
    - Returns structured recommendations with citations
         ↓
[Frontend Display]
    - Renders method cards
    - Shows confidence scores
    - Displays source citations from KB
```

### Knowledge Base Ingestion Flow (Offline)

```
[110K word knowledge base documents]
         ↓
[Ingestion Script: scripts/ingest_knowledge_base.py]
    - Loads documents (PDF, Markdown, etc.)
    - Parses structure
         ↓
[Document Loader]
    - Extracts text, tables, metadata
    - Normalizes format
         ↓
[Chunking Service]
    - Semantic chunking with 1000 token chunks
    - 100 token overlap for context continuity
    - Preserves section headers in metadata
         ↓
[Embedding Service]
    - Generates vector embeddings (1536 dim for OpenAI, or Claude embeddings)
    - Batches requests for efficiency
         ↓
[Vector Store: PostgreSQL + pgvector]
    - Inserts chunks into knowledge_chunks table
    - Creates pgvector indexes (HNSW for speed)
    - Creates full-text search indexes
         ↓
[Validation]
    - Test retrieval with sample queries
    - Verify chunk quality
```

### Wizard State Flow

```
[User starts wizard]
         ↓
[Frontend: POST /api/v1/wizard/sessions]
    - Creates new session in database
    - Returns sessionId
         ↓
[User fills out Step 1]
         ↓
[Frontend Auto-save] (on every change, debounced)
    - PUT /api/v1/wizard/sessions/{sessionId}
    - Sends: { currentStep: 1, formData: {...} }
         ↓
[Backend persists to wizard_sessions table]
    - Updates form_data (JSONB column)
    - Updates updated_at timestamp
         ↓
[User navigates away, returns later]
         ↓
[Frontend: GET /api/v1/wizard/sessions/{sessionId}]
    - Retrieves saved state
    - Hydrates Zustand store
    - User continues from saved step
         ↓
[User completes wizard]
         ↓
[Frontend: POST /api/v1/recommendations]
    - Sends complete form data
    - Marks session as completed
         ↓
[Backend updates session.completed_at]
```

### Quality Scoring Flow

```
[User requests quality score]
         ↓
[Frontend: POST /api/v1/quality/score]
    - Sends evaluation design details
         ↓
[Quality Evaluator Service]
    - Extracts criteria (sample size, control group, etc.)
    - Retrieves best practice criteria from KB via RAG
         ↓
[Scoring Engine]
    - Rule-based checks (e.g., sample size > threshold)
    - LLM-based checks (e.g., "Does theory of change align with outcomes?")
    - Combines scores with weights
         ↓
[Backend Response]
    - Overall score (0-100)
    - Dimension scores (internal validity, external validity, etc.)
    - Improvement suggestions with KB citations
         ↓
[Frontend Display]
    - Visual score breakdown
    - Actionable recommendations
```

## Scaling Considerations

| Concern | At 100 users | At 1K users | At 10K+ users |
|---------|--------------|-------------|---------------|
| **Knowledge Base Retrieval** | Single PostgreSQL with pgvector HNSW index. Query time <100ms. | Same setup, add query caching (Redis) for common queries. Monitor slow queries. | Consider read replicas for retrieval, keep writes on primary. Add vector search CDN/cache. |
| **LLM API Calls** | Direct Claude API calls, handle rate limits gracefully. | Add request queue (Celery + Redis) for async processing, batch non-urgent requests. | Implement caching for similar queries, consider fine-tuned model for common cases. |
| **Session Storage** | PostgreSQL JSONB columns, indexed on user_id. | Same, add session cache (Redis) to reduce DB reads. | Consider session store sharding if users have many concurrent sessions. |
| **Frontend State** | Local Zustand stores, React Query for server state. | Same, add service worker for offline support. | Same, ensure efficient re-renders with memo. |
| **Embedding Generation** | On-demand during ingestion, batch API calls. | Same, cache embeddings to avoid re-computation. | Pre-compute and cache, use dedicated embedding service. |

### Scaling Priorities

1. **First bottleneck: LLM API latency** - Claude API calls are slowest part (2-10s for generation). Mitigation: streaming responses for UX, caching for duplicate queries, async processing for non-urgent recommendations.

2. **Second bottleneck: Vector search at scale** - pgvector is fast but queries slow down with millions of vectors. Mitigation: HNSW indexing (already recommended), query result caching, consider dedicated vector DB (Pinecone, Weaviate) only if exceeding PostgreSQL capacity (unlikely at 110K words).

3. **Third bottleneck: Concurrent wizard sessions** - Many users saving wizard state simultaneously. Mitigation: debounced auto-save (500ms), optimistic UI updates, connection pooling for database.

## Anti-Patterns

### Anti-Pattern 1: Monolithic RAG Component

**What people do:** Put retrieval, reranking, generation, and business logic in one large service/function.

**Why it's wrong:** Impossible to test stages independently, can't optimize embedding model without touching generation, hard to add features like reranking later.

**Do this instead:** Separate into RetrieverService, RerankerService, GeneratorService with clear interfaces. Use dependency injection to compose them. See Pattern 1: Modular RAG Pipeline.

### Anti-Pattern 2: Synchronous LLM Calls in Request Path

**What people do:** Make user wait for 10-second Claude API call before showing any UI feedback.

**Why it's wrong:** Users perceive the app as slow/frozen, high bounce rate, no way to show progress.

**Do this instead:** Stream responses (Pattern 4) or use async task queue for long-running operations. Show loading states immediately. For non-urgent tasks (report generation), return job ID and poll for completion.

### Anti-Pattern 3: Fixed-Size Chunking Without Semantic Boundaries

**What people do:** Split 110K knowledge base into 500-character chunks regardless of content structure.

**Why it's wrong:** Chunks split mid-sentence or mid-concept, retrieval returns incomplete information, LLM generates inaccurate recommendations.

**Do this instead:** Use semantic chunking (Pattern 5) that respects document structure. For impact evaluation KB, preserve method definitions, criteria lists, and guidelines as complete chunks.

### Anti-Pattern 4: Storing Entire Wizard State in Frontend Only

**What people do:** Keep all wizard progress in Zustand/Redux without backend persistence.

**Why it's wrong:** Users lose all work if they close browser, can't resume on different device, no audit trail for government compliance.

**Do this instead:** Implement Pattern 3 (Wizard State Persistence). Auto-save to backend on every change, store in PostgreSQL JSONB. Frontend store is cache, backend is source of truth.

### Anti-Pattern 5: Embedding Everything on Every Query

**What people do:** Re-generate embeddings for knowledge base chunks on each user query.

**Why it's wrong:** Massive waste of API calls and compute, slow query times, high costs. Embeddings for static KB should be pre-computed.

**Do this instead:** Separate ingestion (offline) from querying (online). Ingest once, embed once, query many times. Only re-embed when KB is updated. See Knowledge Base Ingestion Flow.

### Anti-Pattern 6: No Context Window Management

**What people do:** Stuff all retrieved chunks into Claude prompt without checking token limits.

**Why it's wrong:** Hit Claude's context limit (200K tokens), get truncated context or API errors, unpredictable behavior.

**Do this instead:** Count tokens before sending to Claude. Implement truncation strategy: top-k chunks, token budget per chunk, priority-based inclusion. Monitor token usage and log when approaching limits.

### Anti-Pattern 7: Tightly Coupling Frontend to Backend Data Structures

**What people do:** Use backend database models directly in frontend TypeScript types.

**Why it's wrong:** Backend schema changes break frontend, can't evolve independently, exposes implementation details.

**Do this instead:** Define explicit API contracts with OpenAPI/tRPC schema. Backend maps DB models to API DTOs. Frontend uses API types only. Versioned API endpoints (/api/v1/) allow migration.

## Integration Points

### External Services

| Service | Integration Pattern | Notes | Build Phase |
|---------|---------------------|-------|-------------|
| Claude API | Async HTTP client with retry logic, exponential backoff | Use anthropic-sdk-python. Handle rate limits (429), timeout errors. Set max_tokens and temperature explicitly. | Phase 2 |
| OpenAI Embeddings | Batch API calls for efficiency, cache results | Use openai Python SDK. Batch embed up to 100 chunks at a time. Fallback to Claude embeddings if OpenAI unavailable. | Phase 2 |
| PostgreSQL | Connection pooling, read replicas for scale | Use SQLAlchemy async, pgvector extension. Connection pool size = 20 for FastAPI. Enable pg_stat_statements for monitoring. | Phase 1 |

### Internal Boundaries

| Boundary | Communication | Notes | Build Phase |
|----------|---------------|-------|-------------|
| Frontend ↔ Backend | REST API with TypeScript types, React Query for caching | Use OpenAPI spec or tRPC for type safety. React Query handles caching, retries, optimistic updates. | Phase 1 |
| API Layer ↔ Service Layer | Function calls, dependency injection | API validates requests (Pydantic), services contain business logic. Services don't know about HTTP. | Phase 1 |
| Service Layer ↔ RAG Engine | Async function calls | Services call RAG engine with domain queries, RAG engine returns structured responses. RAG engine doesn't know about wizard/projects. | Phase 2 |
| RAG Engine ↔ Retrieval/Generation | Protocol/interface pattern | RAGEngine depends on RetrieverProtocol, not concrete implementations. Allows swapping retrievers without changing engine. | Phase 2 |
| Backend ↔ Database | Repository pattern | Repositories encapsulate SQL queries, return domain models. Services call repositories, not raw SQL. Use Alembic for migrations. | Phase 1 |

## Build Order Implications

Based on component dependencies and architectural patterns:

### Phase 1: Foundation (Weeks 1-3)
**Goal:** Basic wizard flow with backend persistence, no AI yet.

**Components to build:**
1. Database schema (wizard_sessions, projects, users)
2. Backend API skeleton (FastAPI, auth, endpoints)
3. Frontend wizard UI (React Hook Form, Zustand, basic steps)
4. Session persistence (Pattern 3)
5. API client with TypeScript types

**Why this order:**
- Can't build AI features without basic data flow working
- Wizard state persistence must be designed from the start (hard to retrofit)
- Frontend and backend teams can work in parallel once API contract is defined

**Validation:** User can complete wizard, save progress, resume session

### Phase 2: Intelligence (Weeks 4-8)
**Goal:** RAG-powered method recommendations with quality scoring.

**Components to build (in order):**
1. Knowledge base ingestion script (offline)
2. Chunking service (Pattern 5: semantic chunking)
3. Embedding service (OpenAI or Claude)
4. Vector store setup (pgvector with HNSW index)
5. Retrieval service (start with semantic only)
6. Generation service (Claude API integration)
7. RAG engine (Pattern 1: modular pipeline)
8. Recommendation endpoint
9. Quality evaluator service
10. Frontend recommendation display

**Why this order:**
- Must ingest KB before building retrieval (can't test without data)
- Retrieval before generation (generation needs retrieved context)
- Build modular from the start (Pattern 1) even if only 2 stages initially
- Quality evaluator reuses RAG engine, so build after recommendation works

**Validation:** User gets relevant method recommendations with KB citations, quality score matches expected criteria

### Phase 3: Optimization (Weeks 9-12)
**Goal:** Improve relevance, performance, and UX.

**Components to add:**
1. Hybrid retrieval (Pattern 2: add keyword search)
2. Reranking service
3. Streaming responses (Pattern 4)
4. Query caching (Redis)
5. Report generator
6. Advanced quality scoring (more criteria)

**Why this order:**
- These are enhancements, not core functionality
- Streaming improves UX but isn't blocking (can add to working system)
- Reranking requires working retrieval to test against
- Report generation can reuse recommendation templates

**Validation:** Retrieval relevance metrics improve, users see responses stream in, perceived performance better

### Critical Dependencies

```
Database Schema
      ↓
Backend API + Session Persistence ←──┐
      ↓                                │
Frontend Wizard                       │
      ↓                                │
KB Ingestion (offline)                │
      ↓                                │
Chunking → Embeddings → Vector Store  │
      ↓                                │
Retrieval Service                     │
      ↓                                │
Generation Service                    │
      ↓                                │
RAG Engine ──────────────────────────┘
      ↓
Quality Evaluator (reuses RAG)
      ↓
Recommendations Endpoint
      ↓
Frontend Recommendation UI
      ↓
Report Generator
```

**Key insight:** Can't skip ahead. RAG engine depends on having working retrieval and generation services. Quality evaluator reuses RAG engine. Each phase builds on previous.

## Confidence Assessment

| Area | Confidence | Reasoning |
|------|------------|-----------|
| **Overall Architecture** | MEDIUM-HIGH | Verified with multiple 2026 sources, consistent patterns across RAG implementations |
| **Component Boundaries** | HIGH | Standard microservices patterns, verified in FastAPI RAG architectures |
| **Data Flows** | HIGH | RAG pipeline (retrieve → rerank → generate) is well-documented pattern |
| **Tech Stack Fit** | HIGH | PostgreSQL + pgvector confirmed suitable for 110K word KB scale |
| **Build Order** | MEDIUM-HIGH | Logical dependency order, but specific timeline depends on team size |
| **Scaling Considerations** | MEDIUM | Based on typical RAG workloads, but specific bottlenecks depend on usage patterns |
| **Anti-Patterns** | HIGH | Verified through case studies, common RAG mistakes documented |

## Sources

### RAG Architecture Patterns
- [Explaining RAG Architecture: A Deep Dive into Components | Galileo](https://galileo.ai/blog/rag-architecture)
- [RAG Models in 2026: Strategic Guide for Smarter, Accurate Enterprise AI](https://www.techment.com/blogs/rag-models-2026-enterprise-ai/)
- [8 Retrieval Augmented Generation (RAG) Architectures You Should Know in 2025](https://humanloop.com/blog/rag-architectures)
- [🧠 RAG in 2026: A Practical Blueprint for Retrieval-Augmented Generation](https://dev.to/suraj_khaitan_f893c243958/-rag-in-2026-a-practical-blueprint-for-retrieval-augmented-generation-16pp)
- [Design and Develop a RAG Solution - Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide)
- [Advanced RAG: Architecture, Techniques, Applications and Use Cases](https://www.leewayhertz.com/advanced-rag)

### FastAPI RAG Implementation
- [RAG application with Azure OpenAI and Azure AI Search (FastAPI) - Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-openai-search-python)
- [Building a RAG System with LangChain and FastAPI: From Development to Production | DataCamp](https://www.datacamp.com/tutorial/building-a-rag-system-with-langchain-and-fastapi)
- [How to Build a High-Performance RAG API with LangChain and FastAPI](https://medium.com/algomart/how-to-build-a-high-performance-rag-api-with-langchain-and-fastapi-6c9424101877)
- [Python RAG API Tutorial with LangChain & FastAPI](https://www.vitaliihonchar.com/insights/python-rag-api)

### PostgreSQL + pgvector
- [What Is Retrieval Augmented Generation and How to Build a RAG App with pgvector](https://www.enterprisedb.com/blog/rag-app-postgres-and-pgvector)
- [Simplifying RAG with PostgreSQL and PGVector](https://medium.com/@levi_stringer/rag-with-pg-vector-with-sql-alchemy-d08d96bfa293)
- [PostgreSQL with pgvector as a Vector Database for RAG](https://codeawake.com/blog/postgresql-vector-database/)
- [pgvector: Key features, tutorial, and pros and cons [2026 guide]](https://www.instaclustr.com/education/vector-database/pgvector-key-features-tutorial-and-pros-and-cons-2026-guide/)
- [Using PostgreSQL as a vector database in RAG | InfoWorld](https://www.infoworld.com/article/3516109/using-postgresql-as-a-vector-database-in-rag.html)

### Document Chunking Strategies
- [Chunking Strategies for Retrieval-Augmented Generation (RAG): A Comprehensive Guide](https://medium.com/@adnanmasood/chunking-strategies-for-retrieval-augmented-generation-rag-a-comprehensive-guide-5522c4ea2a90)
- [The Ultimate Guide to Chunking Strategies for RAG Applications with Databricks](https://community.databricks.com/t5/technical-blog/the-ultimate-guide-to-chunking-strategies-for-rag-applications/ba-p/113089)
- [Breaking up is hard to do: Chunking in RAG applications - Stack Overflow](https://stackoverflow.blog/2024/12/27/breaking-up-is-hard-to-do-chunking-in-rag-applications/)
- [Chunking Strategies to Improve Your RAG Performance | Weaviate](https://weaviate.io/blog/chunking-strategies-for-rag)

### Component Boundaries & Separation of Concerns
- [The Next Frontier of RAG: How Enterprise Knowledge Systems Will Evolve (2026-2030)](https://nstarxinc.com/blog/the-next-frontier-of-rag-how-enterprise-knowledge-systems-will-evolve-2026-2030/)
- [RAG at Scale: How to Build Production AI Systems in 2026](https://redis.io/blog/rag-at-scale/)
- [Rethinking RAG: Pipelines Are the Past, Agentic Is the Future](https://medium.com/@springrod/rethinking-rag-pipelines-are-the-past-agentic-is-the-future-77c887414621)

### React + AI Integration
- [The React + AI Stack for 2026](https://www.builder.io/blog/react-ai-stack-2026)
- [AI UI Patterns](https://www.patterns.dev/react/ai-ui-patterns/)

### Wizard State Management
- [React Hook Form Multi-Step Tutorial: Zustand + Zod + Shadcn](https://www.buildwithmatija.com/blog/master-multi-step-forms-build-a-dynamic-react-form-in-6-simple-steps)
- [State Management in 2026: Redux, Context API, and Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)

### AI Evaluation Systems
- [Top Tools for AI Evaluation in 2026: A Comprehensive Guide](https://medium.com/@kamyashah2018/top-5-ai-evaluation-platforms-in-2026-comprehensive-comparison-for-production-ai-systems-2e47616dfc7a)
- [Adapting the Facebook Reels RecSys AI Model Based on User Feedback - Engineering at Meta](https://engineering.fb.com/2026/01/14/ml-applications/adapting-the-facebook-reels-recsys-ai-model-based-on-user-feedback/)

---
*Architecture research for: AI-Powered Impact Evaluation Tool with RAG*
*Researched: 2026-01-28*
