# Engine dependency loader

from core.text_engine.engine import TextEngine
from core.brands.store import BrandStore

MODEL_PATH = "models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

engine = TextEngine(model_path=MODEL_PATH)

brand_store = BrandStore()

# Reload saved brands
for brand in brand_store.get_all():

    engine.register_brand(
        brand_id=brand["brand_id"],
        config=brand["config"],
        knowledge_path=None
    )

# Fallback demo brand if nothing exists
if not brand_store.get_all():
    engine.register_brand(
        brand_id="nike",
        config={
            "tone": "energetic",
            "audience": "athletes",
            "banned_words": [],
            "competitors": ["adidas", "puma"],
            "temperature": 0.7,
        },
        knowledge_path=None,
    )

def get_engine():
    return engine