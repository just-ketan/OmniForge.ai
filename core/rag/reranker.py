'''
our current implementation does keyword index + vector store based hybrid retrieval but it still returns noisy data
we can fine tune using reranker module to give it more closer answers to user expectation
it will take query+chunk  and give --> relavance score thats much more 'ACCURATE'
'''
# we do this using cross encoder of sentence tranformers module
from sentence_transformers import CrossEncoder

class Reranker:
    def __init__(self):
        self.mdoel = CrossEncoder("cross-encoder/ms-macro-MiniLM-L-6-v2")
        # small 80MB model that runs aptly on CPU

    def rerank(self, query, chunks, top_k=5):
        pairs = [(query, chunk) for chunk in chunks]
        scores = self.model.predict(pairs)

        ranked = sorted(zip(chunks, scores), key=lambda x : x[1], reverse=True)

        return [chunk for chunk,_ in ranked[:top_k]]