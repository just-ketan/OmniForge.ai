# public interface
import logging
from typing import Dict
from .model_loader import ModelLoader
from .generator import TextGenerator
from .policies import BrandPolicy
from .decoding import OutputFilter
from .prompt_builder import PromptBuilder
logger = logging.getLogger(__name__)

class TextEngine:
    # high level class for brand warare text generation

    def __init__(self, model_path:str):
        self.loader = ModelLoader(model_path=model_path)
        #self.loader().load()
        self.generator = TextGenerator(self.loader.get_model())
        self.brand_configs = {}   # temp in memory store

    def register_brand(self, brand_id:str, config:Dict):
        self.brand_configs[brand_id] = config
        logger.info("Registered brand: %s", brand_id)
    
    def generate(self, brand_id:str, prompt:str) -> str:
        if brand_id not in self.brand_configs:
            raise ValueError(f"Brand '{brand_id}' not registered.")
        
        config = self.brand_configs[brand_id]

        policy = BrandPolicy(config)
        builder = PromptBuilder(config)
        structured_prompt = builder.build(prompt)

        # merge banned and ccompetitors
        combined_words = policy.banned_words + policy.competitors
        filter_layer = OutputFilter(combined_words)

        max_attempts = 3
        for attempt in range(max_attempts):
            raw_output = self.generator.generate(structured_prompt=structured_prompt, policy=policy)
            if not filter_layer.has_violation(raw_output):
                return raw_output
            # if violation, reduce temp and retry
            policy.temperature = max(0.3, policy.temperature-0.1)
        # final fallback sanitize and return
        return filter_layer.sanitize(raw_output)
