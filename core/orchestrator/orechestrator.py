class OmniOrchestrator:
    def __init__(self, engine):
        self.engine = engine

    def run(self, brand_id, query):
        planned_query = self.plan(query)    # planner agent
        context = self.retrieve(brand_id, planned_query)    # retrieve context
        safe_query = self.compliance_check(planned_query)   # compliance check
        response = self.generate(brand_id, safe_query, context) # generate response
        return response
    
    def plan(self, query):
        ## need to implement query rewriting
        return query
    
    def retrieve(self, brand_id, query):
        if brand_id in self.engine.brand_rag:
            return self.engine.brand_rag[brand_id].retrieve_context(query)
        return []   # otw
    
    def compliance_check(self, query):
        # place holder for safety compliance
        return query
    
    def generate(self, brand_id, query, context):
        if context:
            context_text = "\n\n".join([c["text"] for c in context])
            query = f"""
Brand Knowledge: {context_text}
User Request: {query}
"""
            return self.engine.generate(brand_id, query)