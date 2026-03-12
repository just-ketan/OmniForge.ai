# pdf ingestion + chunking
from pypdf import PdfReader

class DocumentLoader:
    def load_pdf(self, path:str) -> str:
        reader = PdfReader(path)
        text=""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    
    def chunk_text(self, text:str, chunk_size:int=500, overlap:int=50):
        chunks = []
        start = 0
        while start < len(text):
            end = start+chunk_size
            chunks.append(text[start:end])
            start += chunk_size-overlap
        return chunks
