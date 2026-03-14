from .reranker import Reranker

class Retriever:
    def __init__(self, embedder, vector_store, keyword_index):
        self.embedder = embedder
        self.vector_store = vector_store
        self.keyword_index = keyword_index
        self.reranker = Reranker()

    def retrieve(self, query, top_k=5, threshold=1.2, section=None):
        query_embedding = self.embedder.encode_query(query)
        vector_results = self.vector_store.search(query_embedding, top_k)
        keyword_indices = self.keyword_index.search(query, top_k)

        hybrid = []

        for r in vector_results:
            data = r["data"]
            if section and data.get("section") != section:
                continue
            if r["score"] <= threshold:
                hybrid.append(data["text"])

        for idx in keyword_indices:
            data = self.vector_store.metadata[idx]
            if section and data.get("section") != section:
                continue

            hybrid.append(data["text"])
        # remove duplicates and restrict to top_k results
        unique_chunks = list(set(hybrid))
        reranked = self.reranker.rerank(query, unique_chunks, top_k=top_k)
        return reranked

        '''
        filtered = []
        for r in results:
            data = r["data"]
            # section filtering
            if section and data.get("section") != section:
                continue

            # similarity filtering
            if r["score"] <= threshold:
                
                FAISS L2 distances work like this :-
                0.0 → identical
                0.5 → very similar
                1.0 → somewhat similar
                >2.0 → probably irrelevant

                thus we make sure its less than 1.2
                
                filtered.append(data["text"])
        return filtered

        '''