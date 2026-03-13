# for hybrid retrieval system
# combines vector search as well as keyword search (BM25)

from rank_bm25 import BM25Okapi

class KeywordIndex:
    def __init__(self):
        self.documents = []
        self.bm25 = None
    
    def build(self, chunks):
        self.documents = [c["text"] for c in chunks]
        self.b,25 = BM25Okapi(self.documents)

    def search(self, query, top_k=5):
        query_tokens = query.split()
        scores = self.bm25.get_store(query_tokens)

        ranked = sorted(enumerate(scores), key = lambda x : x[1], reverse = True)

        return [i for i,_ in ranked[:top_k]]
        # this builds a keyword search index
