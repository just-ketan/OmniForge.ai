import os
import faiss
import pickle
import numpy as np

class VectorStore:
    def __init__(self, brand_id, embedding_dim):
        self.brand_id = brand_id
        self.embedding_dim = embedding_dim
        self.base_path = f"data/vector_db/{brand_id}"
        self.index_path = os.path.join(self.base_path, "index.faiss")
        self.meta_path = os.path.join(self.base_path, "metadata.pkl")

        self.index = None
        self.metadata = []
        self._initialize()

    def _initialize(self):
        os.makedirs(self.base_path, exist_ok=True)
        # load if exists otw make the index
        if os.path.exists(self.index_path):
            self.load()
        else:
            self.index = faiss.IndexFlatL2(self.embedding_dim)

    def add(self, embeddings, metadata):
        embeddings = np.array(embeddings).astype("float32")
        self.index.add(embeddings)
        self.metadata.extend(metadata)
    
    def search(self, query_embedding, top_k=5):
        query_embedding = np.array(query_embedding).astype("float32")

        # ensure FAISS receives (n_queries, dim)
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)

        distances, indices = self.index.search(query_embedding, top_k)
        results = []

        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.metadata):
                results.append({
                    "score" : float(dist),
                    "data" : self.metadata[idx]
                })
        return results
    
    def save(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.metadata, f)
    
    def load(self):
        self.index = faiss.read_index(self.index_path)
        if os.path.exists(self.meta_path):
            with open(self.meta_path, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.metadata = []