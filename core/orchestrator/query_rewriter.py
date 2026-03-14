from sentenct_transformers import SentenceTranformer

class QueryRewriter:
    def __init__(self):
        self.model = SentenceTranformer("all-MiniLM-L6-v2")
    
    def rewrite(self, query):
        query = query.strip()   # simple rewrite rule
        if not query.endsWith("?"):
            query = query+" marketing content"

        return query