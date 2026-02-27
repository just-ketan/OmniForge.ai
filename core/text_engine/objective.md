## Enforce Banned Words
## Prevents competitor mentions
## supports deterministic decodings
## allows brand-specifc decoding profiles
## ready to integrate with RAG later

### The output looks like
```yaml
text_engine.generate(
    brand_id="nike",
    prompt="Write a LinkedIn post about our new running shoes"
)
```

#### 1. Tokenizer Manager
    - load tokeniser 
    - inject special tokens
    - handle padding + truncation
    - enforce max token budget

#### 2. Brand Policy Manager
    ```yaml
        {
        "banned_words": [],
        "competitors": [],
        "temperature": 0.6,
        "top_p": 0.9,
        "deterministic": False
        }
    ```
    the above must load dynamically per request

#### 3. Decoding Controller (CORE)
    the Core Differentiator
        - custom LogitsProcessor
        - Hard TOken suppression
        - optimal deterministic mode
        - custom stop sequence
    
#### 4. Generation Pipeline
    reposible for 
        - feeding prompts
        - applying decoding constrains
        - returns structured output
        
