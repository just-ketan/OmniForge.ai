from fastapi import FastAPI, Depends
from api.schemas import (BrandRegistration, GenerateResponse, GenerationRequest)
from api.dependencies import get_engine
from core.text_engine.engine import TextEngine
from fastapi import StreamingResponse

app = FastAPI(
    title="OmniForge.ai",
    description="Brand Intelligence Generation System",
    version="0.1"
)

@app.get("/")
def health():
    return {"status":"OmniForge Running"}

@app.post("/register_brand")
def register_brand(request: BrandRegistration, engine : TextEngine = Depends(get_engine)):
    engine.register_brand(brand_id=request.brand_id, config=request.config, knowledge_path=request.knowledge_path)
    return {"message":"Brand Registation successfully"}

@app.post("/generate", response_model=GenerateResponse)
def generate_text(request:GenerationRequest, engine:TextEngine = Depends(get_engine)):
    output = engine.generate(brand_id=request.brand_id, prompt=request.prompt)
    return {"output":output}

@app.post("/generate_stream")
def generate_stream(request:GenerationRequest, engine:TextEngine = Depends(get_engine)):
    def token_generator():
        for token in engine.generate_stream(request.brand_id, request.prompt):
            yield token
    return StreamingResponse(token_generator(), media_type="text/plain")