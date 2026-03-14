from sentence_transformers import SentenceTransformer

class QueryRewriter:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
    
    def rewrite(self, query):
        query = query.strip()   # simple rewrite rule
        if not query.endswith("?"):
            query = query+" marketing content"

        return query