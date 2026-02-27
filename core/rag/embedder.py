# small but strong embedding model
# fast on CPU with 90MB size
# industry standard baseline and good semantic retrieval

from sentence_transformer import SentenceTransformer
import numpy as np

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-V2")
    
    def encode(self, texts):
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return np.array(embeddings).astype("float32")