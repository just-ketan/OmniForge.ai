from .document_loader import DocumentLoader
from .vector_store import VectorStore
from .embedder import Embedder
from .retriever import Retriever

class RAGPipeline:
    def __init__(self, brand_id):
        self.brand_id = brand_id
        self.loader = DocumentLoader()
        self.embedder = Embedder()
        self.vector_store = VectorStore(brand_id=self.brand_id, embedding_dim=self.embedder.dimension)
        self.retriever = Retriever(self.embedder, self.vector_store)
    
    def ingest_pdf(self, path:str):
        text = self.loader.load_pdf(path)
        chunks = self.loader.chunk_text(text)
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
        if not self.retriever:
            return []
        return self.retriever.retrieve(query)
    