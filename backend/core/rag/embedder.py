# small but strong embedding model
# fast on CPU with 90MB size
# industry standard baseline and good semantic retrieval

from sentence_transformers import SentenceTransformer
import numpy as np

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-V2")
        self.dimension = self.model.get_sentence_embedding_dimension()
    
    def encode(self, texts):
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return np.array(embeddings).astype("float32")

    def encode_query(self, query):
        embedding = self.model.encode([query], convert_to_numpy=True)
        return embedding[0].astype("float32")