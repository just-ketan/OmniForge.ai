import logging
from llama_cpp import Llama
from .policies import BrandPolicy
logger = logging.getLogger(__name__)

class TextGenerator:
    # handles inference calls to llama.cpp
    def __init__(self, model: Llama):
        self.model = model
    
    def generate(self, structured_prompt:str, policy:BrandPolicy) -> str:
        try:
            logger.info("Generating text with temperature=%s | top_p=%s | max_tokens=%s", policy.get_effective_temperature(), policy.get_effective_top_p(), policy.max_tokens)
            response = self.model(structured_prompt, max_tokens=policy.max_tokens, temperature=policy.temperature, top_p=policy.top_p, stop=["</s>"],)
            text = response["choices"][0]["text"]
            return text.strip()
        except Exception as e:
            logger.exception("Text generaiton failed")
            raise RuntimeError("Generation error") from e
