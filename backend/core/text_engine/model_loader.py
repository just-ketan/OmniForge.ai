import logging
from llama_cpp import Llama

logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None

    def load(self):
        try:
            logger.info("Loading model from %s", self.model_path)

            if self.model is None:
                self.model = Llama(
                    model_path=self.model_path,
                    n_ctx=2048,
                    n_threads=8,
                )

            logger.info("Model Loaded Successfully")

        except Exception as e:
            logger.warning(
                "LLM unavailable. Running in development mode."
            )

            self.model = None

    def get_model(self):
        return self.model
