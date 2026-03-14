# OmniForge.ai

OmniForge.ai is an autonomous AI-powered marketing campaign generator that combines Large Language Models, Retrieval-Augmented Generation (RAG), Neural Search, and Generative Vision models to create brand-aligned campaign text and visuals.

The system retrieves brand knowledge, rewrites queries intelligently, generates contextual marketing copy, and produces campaign images — all through a unified orchestration engine.

## Key Features
  Autonomous Campaign Generation
  Generates brand-aware marketing campaigns
  Uses LLM + RAG context retrieval
  Hybrid Retrieval System
  Combines two search approaches:
    Semantic Search (FAISS Vector DB)
    Keyword Search (BM25)
  Results are merged and reranked using a neural cross-encoder.

  Neural Reranking
    Uses a CrossEncoder transformer to select the most relevant knowledge chunks before generation.

  Vision Generation
  Uses Stable Diffusion to generate campaign visuals aligned with the generated text.

  Modular AI Architecture
  The system is built as independent AI modules:
    Text Engine
    RAG Pipeline
    Vision Engine
    Orchestration Agent
    FastAPI Serving

Provides REST APIs for campaign generation.

System Architecture
```yaml
User Prompt
     │
     ▼
Query Rewriter
     │
     ▼
Hybrid Retrieval
 ┌─────────────┐
 │ FAISS Vector│
 │ BM25 Keyword│
 └─────────────┘
     │
     ▼
Neural Reranker (CrossEncoder)
     │
     ▼
Context Augmentation
     │
     ▼
Mistral LLM Generator
     │
     ├── Campaign Text
     │
     ▼
Vision Engine (Stable Diffusion)
     │
     ▼
Campaign Image
```

Project Structure
```yaml
OmniForge.ai
│
├── api/
│   ├── server.py
│   ├── dependencies.py
│   └── tasks.py
│
├── core/
│   │
│   ├── orchestrator/
│   │   └── orchestrator.py
│   │
│   ├── text_engine/
│   │   └── engine.py
│   │
│   ├── rag/
│   │   ├── pipeline.py
│   │   ├── retriever.py
│   │   ├── reranker.py
│   │   ├── keyword_index.py
│   │   └── vector_store.py
│   │
│   ├── vision_engine/
│   │   ├── engine.py
│   │   ├── diffusion.py
│   │   └── vae.py
│
├── models/
│   └── mistral-7b-instruct-v0.2.gguf
│
├── outputs/
│
└── README.md
```

## Technology Stack
  Component	Technology
  LLM	Mistral 7B
  Embeddings	SentenceTransformers
  Vector DB	FAISS
  Keyword Search	BM25
  Reranker	CrossEncoder
  Image Generation	Stable Diffusion
  Backend API	FastAPI
  Task Queue	Celery
  Cache	Redis

## Installation
```bash
1. Clone Repository
git clone https://github.com/yourusername/OmniForge.ai.git
cd OmniForge.ai
2. Create Virtual Environment
python -m venv .venv
source .venv/bin/activate

4. Start Redis
redis-server
5. Start API Server
uvicorn api.server:app --host 0.0.0.0 --port 8000
```

Open: http://localhost:8000/docs


Example API Request
```bash
POST /generate_campaign
Request:

{
  "brand_id": "nike",
  "prompt": "Generate a motivational campaign for new running shoes"
}

Response:

{
  "text": "Nike campaign copy...",
  "image": "outputs/nike_image.png"
}
```

## RAG Pipeline
The system uses hybrid retrieval for higher accuracy.

### Step 1 — Semantic Search
  Vector similarity using FAISS embeddings

### Step 2 — Keyword Search
  BM25 keyword retrieval

### Step 3 — Neural Reranking
  CrossEncoder ranks the combined results.

### Step 4 — Context Injection
  Top context chunks are added to the prompt.

### Step 5 — Generation
  Mistral LLM generates the final campaign.

### Vision Generation
  The Vision Engine uses:
    Stable Diffusion
    Custom VAE pipeline

### Prompt conditioning from campaign text
  This produces campaign visuals aligned with generated copy.


Example Output
  Campaign Text:
    Run Beyond Limits.
    Nike introduces the new AeroStride series — engineered for athletes who refuse to slow down.

  Generated Image:
    outputs/nike_image.png


### Why This Project Matters
  OmniForge demonstrates real-world AI engineering:
  LLM orchestration
  Retrieval-Augmented Generation
  Neural search systems
  Hybrid information retrieval
  Vision generation pipelines
  Production API deployment

It showcases end-to-end AI system design, not just model usage.