# public interface
import logging
from typing import Dict, Optional
from .model_loader import ModelLoader
from .generator import TextGenerator
from .policies import BrandPolicy
from .decoding import OutputFilter
from .prompt_builder import PromptBuilder

from core.rag.pipeline import RAGPipeline

logger = logging.getLogger(__name__)

class TextEngine:
    # high level class for brand warare text generation

    def __init__(self, model_path:str):
        self.loader = ModelLoader(model_path=model_path)
        self.loader.load()
        self.generator = TextGenerator(self.loader.get_model())
        self.brand_configs = {}   # temp in memory store
        # per brand RAG pipeline
        self.brand_rag: Dict[str, RAGPipeline] = {}

    def register_brand(self, brand_id:str, config:Dict, knowledge_path:Optional[str]=None):
        # register a brand config and optionally ingest brand knowledge in RAG
        self.brand_configs[brand_id] = config
        logger.info("Registered brand: %s", brand_id)
        rag = RAGPipeline(brand_id=brand_id)
        self.brand_rag[brand_id] = rag
        if knowledge_path:
            logger.info("Ingesting knowledge for brand : %s", brand_id)
            rag.ingest_pdf(knowledge_path)
    
    
    def generate(self, brand_id:str, prompt:str) -> str:
        if brand_id not in self.brand_configs:
            raise ValueError(f"Brand '{brand_id}' not registered.")
        
        config = self.brand_configs[brand_id]
        policy = BrandPolicy(config)

        # retrieve text from RAG
        context_text=""
        if brand_id in self.brand_rag:
            context_chunks = self.brand_rag[brand_id].retrieve_context(prompt)
            context_text = "\n\n".join([c["text"] for c in context_chunks])
        
        builder = PromptBuilder(config)

        if context_text:
            augmented_prompt = f"""
                Brand Knowledge: {context_text}
                User Request: {prompt}
            """
        else:
            augmented_prompt = prompt

        structured_prompt = builder.build(augmented_prompt)

        # merge banned and competitors for filtering
        combined_words = policy.banned_words + policy.competitors
        filter_layer = OutputFilter(combined_words)

        max_attempts = 3
        for attempt in range(max_attempts):
            raw_output = self.generator.generate(structured_prompt=structured_prompt, policy=policy)
            if not filter_layer.has_violation(raw_output):
                return raw_output
            # if violation, reduce temp and retry
            logger.warning("Policy Violation detected. Retrying.... Ateemp: %s", attempt+1)
            policy.temperature = max(0.3, policy.temperature-0.1)
        # final fallback sanitize and return
        return filter_layer.sanitize(raw_output)
