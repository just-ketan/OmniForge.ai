# llama.cpp backend. suits my system requirement and hellucinates less. i have no GPU so this works for me.
# Mistral 7B Instruct (GGUF Q4_K_M)

import logging
from llama_cpp import Llama
from typing import Optional
logger = logging.getLogger(__name__)

class ModelLoader:
    # loads and manages llama.cpp model instance
    def __init__(self, model_path:str, n_cxt: int=4096, n_threads: Optional[int]=None,):
        self.model_path = model_path
        self.n_cxt = n_cxt
        self.n_threads = n_threads
        self.model : Optional[Llama] = None
    
    def load(self) -> None:
        # load quantized GGUF model
        try:
            logger.info("Loading model from %s", self.model_path)
            self.model = Llama(model_path=self.model_path, n_ctx=self.n_cxt, n_threads=self.n_threads, verbose=False,)
            logger.info("Model Loaded Successfully")
        except Exception as e:
            logger.exception("Failed to load model.")
            raise RuntimeError("Model Loading Failed.") from e
    
    def get_model(self) -> Llama:
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load() first.")
        return self.model