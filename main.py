# test driver
import logging
from core.text_engine.engine import TextEngine

logging.basicConfig(level=logging.INFO)
MODEL_PATH="models/mistral-7b-instruct-q4-k-m.gguf"
engine = TextEngine(model_path=MODEL_PATH)
engine.register_brand("nike",{"banned_words":["cheap", "discount"], "competitors":["adidas","puma"], "temperature":0.6, "top_p":0.9, "deterministic":False, "max_tokens":200,},)
resonse = engine.generate("nike", "write a premium linkedin post about our new performance running shoe.")
print(response)
