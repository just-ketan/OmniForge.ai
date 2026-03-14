from fastapi import FastAPI, Depends
from api.schemas import (BrandRegistration, GenerateResponse, GenerationRequest)
from api.dependencies import get_engine
from core.text_engine.engine import TextEngine
from api.tasks import generate_text_task
from api.tasks import celery
from fastapi.responses import StreamingResponse

from core.feedback.store import FeedbackStore
from api.schemas_feedback import FeedbackRequest

from core.training.dataset_builder import DatasetBuilder
from core.training.lora_trainer import LoRATrainer

from core.orchestrator.orechestrator import OmniOrchestrator 

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

@app.post("/generate_async")
def generate_async(request:GenerationRequest):
    task = generate_text_task.delay(request.brand_id, request.prompt)
    return {
        "task_id" : task.id,
        "status" : "queued"
    }

@app.get("/task/{task_id}")
def get_task(task_id):
    task = celery.AsyncResult(task_id)
    if task.ready():
        return {
            "status" : "completed",
            "result" : task.result
        }
    return {"status":"processing"}

## creating feedback api
feedback_store = FeedbackStore()
@app.post("/feedback")
def submit_feedback(req : FeedbackRequest):
    feedback_store.save(
        prompt=req.prompt,
        response=req.response,
        rating=req.rating,
        brand_id=req.brand_id
    )
    return {"status":"feedback recorded"}

## dataset trainer
dataset_builder = DatasetBuilder()
trainer = LoRATrainer()

@app.post("/train_lora")
def train_model():
    dataset_size = dataset_builder.build_dataset()
    trainer.train("data/training/lora_dataset.json1", "models/lora_adapter")
    return {
        "stats" : "training_started",
        "dataset_size" : dataset_size
    }

## orchestrator init
orchestrator = OmniOrchestrator(get_engine())
@app.post("/generate_campaign")
def generate(req : GenerationRequest):
    res = orchestrator.run(req.brand_id, req.prompt)
    return res

