## rewrite queries using LLM for LLM to give better outputs

class QueryRewriter:
    def __init__(self, generator):
        self.generator = generator
    
    def rewrite(self, query):
        prompt=f"""
Rewrite the user query to improve informational retrieval. Expand it with relevant keywords but keep the intent identical.
User Query : {query}
Rewritten Query : 
"""
        rewritten = self.generator.generate_raw(prompt)
        return rewritten.strip()