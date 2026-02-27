import faiss
import numpy as np

class VectorStore:
    def __inti__(self, dim:int):
        self.index = faiss.IndexFlatL2(dim)
        self.texts = []

    def add(self, embeddings: np.ndarray, texts):
        self.index.add(embeddings)
        self.texts.extend(texts)
    
    def search(self, query_embedding: np.ndarray, top_k:int = 3):
        distances, indices = self.index.search(query_embeddings, top_k)
        results = [self.texts[i] for i in indices[0]]
        return results
    
    
