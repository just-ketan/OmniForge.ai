# Engine dependency loader

from core.text_engine.engine import TextEngine

MODEL_PATH = "models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
engine = TextEngine(model_path=MODEL_PATH)
def get_engine():
    return engine

# ensures LLM loads globally (once)