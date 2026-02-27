# public interface
import logging
from typing import Dict
from .model_loader import ModelLoader
from .generator import TextGenerator
from .policies import BrandPolicy
from .decoding import OutputFilter
logger = logging.getLogger(__name__)

class TextEngine:
    # high level class for brand warare text generation

    def __init__(slef, model_path:str):
        self.loader = ModelLoader(model_path=model_path)
        self.loader().load()

        self.generator = TextGenerator(self.loader.get_model())

        self.brand_configs:Dict[str, Dict] = {}   # temp in memory store

    def register_brand(self, brand_id:str, config:Dict):
        self.brand_configs[brand_id] = config
        logger.info("Registered brand: %s", brand_id)
    
    def generate(self, brand_id:str, prompt:str) -> str:
        if brand_id not in self.brand_configs:
            raise ValueError(f"Brand '{brand_id}' not registered.")

        policy = BrandPolicy(self.brand_configs[brand_id])
        raw_output = self.generator.generate(prompt, policy)

        # merge banned and ccompetitors
        combined_words = policy.banned_words + policy.competitors
        filter_layer = OutputFilter(combined_words)
        final_output = filter_layer.sanitize(raw_output)
        return final_output