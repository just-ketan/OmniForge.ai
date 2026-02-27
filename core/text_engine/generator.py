import logging
from llamap_cpp import Llama
from .policies import BrandPolicy
logger = logging.getLogger(__name__)

class TextGenerator:
    # handles inference calls to llama.cpp
    def __init__(self, model: Llama):
        self.model = model
    
    def generate(self, prompt:str, policy:BrandPolicy) -> str:
        try:
            logger.info("Generating teext with temperature=%s, top_p=%s", policy.get_effective_temperature(), policy.get_effective_top_p())
            output = self.model(prompt, max_tokens=policy.max_tokens, temperature=policy.get_effective_temperature(), top_p=policy.get_effective_top_p(), stop=["</s>"],)
            text = output["choices"][0]["text"]
            return text.strip()
        except Exception as e:
            logger.exception("Text generaiton failed")
            raise RuntimeError("Generation error") from e