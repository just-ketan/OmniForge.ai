# OmniForge.ai — System Design Overview

This document describes the **end-to-end system design** of OmniForge.ai, focusing on architecture, data flow, component responsibilities, and key design decisions.

---

## 1. Design Goals

### Primary Goals
- Enforce **brand consistency** across text and visuals
- Prevent hallucinations using **retrieval grounding + decoding control**
- Enable **human-in-the-loop alignment** without retraining base models
- Support **multi-brand, multi-tenant** usage safely

### Non-Goals (Initial Phases)
- Fully autonomous marketing strategy generation
- Continuous online fine-tuning of foundation models
- Cross-brand learning or shared representations

---

## 2. High-Level Architecture

OmniForge follows a **Decoupled Micro-Engine Architecture** coordinated by a deterministic routing agent.

```cpp
┌──────────┐
│  Client  │
└────┬─────┘
     ↓
┌──────────────┐
│  API Gateway │
└────┬─────────┘
     ↓
┌────────────────────────┐
│  Chief Marketing Agent │ ← Control Plane
│ (Deterministic Router) │
└────┬─────────┬─────────┘
     │         │
     │         │
┌────▼───┐ ┌───▼────────┐
│    RAG │ │ Text Engine│
│ Engine │ │      (LLM) │
└────┬───┘ └────┬───────┘
     │          │
  ┌──▼──────────▼─┐
  │    Vision     │
  │    Engine     │
  └───────────────┘
         │
    ┌────▼────────┐
    │  Feedback   │
    │   Engine    │
    └─────────────┘
```


---

## 3. Core Design Principle

> **Reasoning, generation, and alignment must be separated.**

- Agents **decide**
- Models **generate**
- Humans **align**
- Storage **isolates**

This separation prevents cascading failures and makes the system debuggable.

---

## 4. Component-Level Design

### 4.1 API Gateway

**Responsibilities**
- Authentication & brand identification
- File uploads (PDFs, images)
- Request validation
- Streaming responses

**Key Properties**
- Stateless
- No AI logic
- Brand ID injected into all downstream calls

---

### 4.2 Chief Marketing Agent (Router)

The agent acts as a **control plane**, not a creative model.

**Inputs**
- User query
- Brand ID
- Session state

**Outputs**
- Execution plan (tool selection + order)
- Constraints for downstream engines

**Decisions Made**
- Is retrieval required?
- Text only vs text → image?
- Which LoRA to load?
- Which decoding constraints apply?

**Important Constraint**
- Routing is **deterministic** (no temperature, no randomness)

---

### 4.3 Session State Management

Stored externally (Redis / DB).

**Maintains**
- Active brand
- Platform (LinkedIn, Instagram, etc.)
- Tone preferences
- Previous constraints

**Why External State**
- Agents remain stateless
- Horizontal scalability
- Replayable sessions

---

## 5. Knowledge Retrieval Engine (RAG)

### Ingestion Pipeline
1. PDF parsing
2. Chunking (text + tables)
3. Metadata attachment
4. Embedding generation
5. Brand-specific vector storage

### Retrieval Pipeline
- Semantic search within **brand namespace**
- Top-k filtering with score threshold
- Context packing with hard token limits

**Design Rule**
> No factual generation without retrieved context.

---

## 6. Text Engine Design

### Components
- Tokenizer
- Generator
- Custom Decoding Logic

### Decoding Control (Critical)
- Logit processors for:
  - Banned words
  - Competitor names
  - Tone violations
- Brand-specific decoding profiles:
  - Temperature
  - Top-p
  - Stop sequences

**Failure Mode Prevented**
- Hallucination during decoding (most common LLM failure)

---

## 7. Vision Engine Design

### Diffusion Pipeline
- Base Stable Diffusion model
- Brand-specific LoRA loaded at inference
- Dedicated VAE for fidelity

### LoRA Strategy
- One LoRA per brand
- No shared fine-tuning
- Rank-limited for stability

**Text → Image Flow**
- Text engine outputs structured style tokens
- Vision engine consumes tokens + prompt
- No free-form interpretation

---

## 8. Feedback & Alignment Engine (RLHF-Lite)

### Feedback Collection
- Binary feedback (👍 / 👎)
- Pairwise ranking (A vs B)

### What Feedback Influences
- Agent routing preferences
- Prompt weighting
- Decoding parameters

### What Feedback Does NOT Influence
- Base LLM weights (initial phases)

**Reason**
- Avoid catastrophic forgetting
- Preserve brand isolation
- Keep costs low

---

## 9. Brand Isolation Model

Each brand is isolated at **every layer**:

| Layer | Isolation |
|-----|----------|
| Embeddings | Separate vector index |
| Prompts | Brand-specific policy |
| LoRA | One per brand |
| Feedback | Brand-scoped |
| Sessions | Brand-bound |

**Result**
- Zero brand bleed
- Legal safety
- Predictable outputs

---

## 10. Asynchronous Processing

### Why Async Is Required
- Diffusion is GPU-heavy
- Image generation latency is high

### Strategy
- Text generation: synchronous + streaming
- Image generation: async (Celery / Redis)
- Status polling or webhook-based delivery

---

## 11. Security Considerations

### Threats Addressed
- Prompt injection
- Brand leakage
- Malicious uploads

### Mitigations
- Hard brand namespace enforcement
- Prompt sanitization
- File validation
- Retrieval-only factual grounding

---

## 12. Scalability Strategy

### Horizontal Scaling
- Stateless agents
- Shared vector DB
- Brand-isolated storage

### Vertical Scaling
- Quantized models (4-bit / 8-bit)
- LoRA instead of full fine-tuning

---

## 13. Failure Handling

| Failure | Mitigation |
|------|-----------|
| No relevant RAG context | Safe refusal |
| Image generation timeout | Fallback message |
| Policy violation | Regenerate with stricter decoding |
| Feedback abuse | Rate limiting |

---

## 14. Design Trade-offs

### Chosen
- Control > creativity
- Determinism > autonomy
- Isolation > shared learning

### Deferred
- Full RLHF fine-tuning
- Cross-brand generalization
- Autonomous campaign planning

---

## 15. Summary

OmniForge.ai is designed as a **brand-aligned generative control system**, not a generic chatbot.

- Agents control decisions
- Models generate content
- Humans align behavior
- Brands remain isolated

This architecture prioritizes **trust, consistency, and enterprise readiness** over novelty.

---
