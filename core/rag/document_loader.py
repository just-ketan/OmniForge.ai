# pdf ingestion + chunking
from pypdf import PdfReader

class DocumentLoader:
    def load_pdf(self, path:str) -> str:
        reader = PdfReader(path)
        text=""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text+"\n"
        return text
    
    def chunk_text(self, text:str, chunk_size:int=500, overlap:int=50):
        chunks = []
        '''
        start = 0
        while start < len(text):
            end = start+chunk_size
            chunks.append(text[start:end])
            start += chunk_size-overlap
        return chunks
        '''
        for i in range(0, len(text), chunk_size-overlap):
            chunk = text[i:i+chunk_size].strip()
            if not chunk:
                continue
            metadata = {
                "text" : chunk,
                "section" : "general"
            }
            chunks.append(metadata) # returning structured chunks
        return chunks
