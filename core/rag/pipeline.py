from .document_loader import DocumentLoader
from .vector_store import VectorStore
from .embedder import Embedder
from .retriever import Retriever

class RAGPipeline:
    def __init__(self):
        self.loader = DocumentLoader()
        self.retriever = None
        self.embedder = Embedder()
        self.vector_store = None
    
    def ingest_pdf(self, path:str):
        text = self.loader.load_pdf(path)
        chunks = self.loader.chunk_text(path)

        embeddings = self.embedder.encode(chunks)   #encode the chunks

        dim = embeddings.shape[1]
        self.vector_store = VectorStore()
        self.vector_store.add(embeddings, chunks)

        self.retriever = Retriever(self.embedder, self.vector_store)

    def retrieve_context(self, query:str):
        if not self.retriver:
            return []
        return self.retriever.retrieve(query)
    