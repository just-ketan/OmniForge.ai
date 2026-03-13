class Retriever:
    def __init__(self, embedder, vector_store):
        self.embedder = embedder
        self.vector_store = vector_store

    def retrieve(self, query, top_k=5, threshold=1.2):
        query_embedding = self.embedder.encode_query(query)
        results = self.vector_store.search(query_embedding, top_k)
        filtered = []
        for r in results:
            if r["score"] <= threshold:
                '''
                FAISS L2 distances work like this :-
                0.0 → identical
                0.5 → very similar
                1.0 → somewhat similar
                >2.0 → probably irrelevant

                thus we make sure its less than 1.2
                '''
                filtered.append(r["data"])
        return filtered