# Engine dependency loader

from core.text_engine.engine import TextEngine

MODEL_PATH = "models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
engine = TextEngine(model_path=MODEL_PATH)
# Register demo brand
engine.register_brand(
    brand_id="nike",
    config={
        "tone": "energetic",
        "audience": "athletes",
        "banned_words": [],
        "competitors": ["adidas", "puma"],
        "temperature": 0.7
    },
    knowledge_path=None  # or add brand pdf later
)
def get_engine():
    return engine

# ensures LLM loads globally (once)