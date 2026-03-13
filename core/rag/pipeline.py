from .document_loader import DocumentLoader
from .vector_store import VectorStore
from .embedder import Embedder
from .retriever import Retriever
from .keyword_index import KeywordIndex
from .query_rewriter import QueryRewriter

class RAGPipeline:
    def __init__(self, brand_id):
        self.brand_id = brand_id
        self.loader = DocumentLoader()
        self.embedder = Embedder()
        self.vector_store = VectorStore(brand_id=self.brand_id, embedding_dim=self.embedder.dimension)
        self.keyword_index = KeywordIndex()
        self.retriever = Retriever(self.embedder, self.vector_store, self.keyword_index)
        # method to rewrite query
        self.query_rewriter = None
        def attach_query_rewriter(self, generator):
            self.query_rewriter = QueryRewriter(generator=generator)
    
    def ingest_pdf(self, path:str):
        text = self.loader.load_pdf(path)
        chunks = self.loader.chunk_text(text)
        self.keyword_index.build(chunks=chunks)
        texts = [c["text"] for c in chunks]

        embeddings = self.embedder.encode(texts)   #encode the chunks

        metadata = []
        for i, chunk in enumerate(chunks):
            metadata.append({
                "text":chunk["text"],
                "section": chunk["section"],
                "source":path,
                "chunk_id":i
            })

        # dim = embeddings.shape[1]
        self.vector_store.add(embeddings, metadata=metadata)
        self.vector_store.save()

    def retrieve_context(self, query:str):
        if self.query_rewriter:
            query = self.query_rewriter.rewrite(query)
        if not self.retriever:
            return []
        return self.retriever.retrieve(query)
    

    