class Retriever:
    def __init__(self, embedder, vector_store):
        self.embedder = embedder
        self.vector_store = vector_store

    def retrieve(self, query:str, top_k:int = 3):
        query_embedding = self.embedder.encode([query])
        results = self.vector_store.search(query_embedding, top_k)
        return results