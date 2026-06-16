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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.campaigns.store import CampaignStore

from core.campaigns.campaign_generator import CampaignGenerator
from core.brands.store import BrandStore



campaign_store = CampaignStore()
campaign_generator = CampaignGenerator()
brand_store = BrandStore()

app = FastAPI(
    title="OmniForge.ai",
    description="Brand Intelligence Generation System",
    version="0.1"
)

app.mount(
	"/outputs",
	StaticFiles(directory="outputs"),
	name="outputs"
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status":"OmniForge Running"}

@app.post("/register_brand")
def register_brand(request: BrandRegistration, engine: TextEngine = Depends(get_engine)):
    engine.register_brand(
        brand_id=request.brand_id,
        config=request.config,
        knowledge_path=request.knowledge_path
    )

    brand_store.save({
        "brand_id": request.brand_id,
        "config": request.config
    })

    return {
        "message": "Brand registered successfully"
    }

@app.post("/generate", response_model=GenerateResponse)
def generate_text(request:GenerationRequest, engine:TextEngine = Depends(get_engine)):
    output = engine.generate(brand_id=request.brand_id, prompt=request.prompt)
    return {"output":output}

@app.post("/generate_stream")
def generate_stream(
    request: GenerationRequest,
    engine: TextEngine = Depends(get_engine)
):
    def token_generator():
        full_output = ""

        for token in engine.generate_stream(
            request.brand_id,
            request.prompt
        ):
            full_output += token
            yield token

        campaign_store.save({
            "brand_id": request.brand_id,
            "prompt": request.prompt,
            "campaign": full_output
        })

    return StreamingResponse(
        token_generator(),
        media_type="text/plain"
    )

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
@app.post("/generate_campaign_v1")
def generate(req : GenerationRequest):
    res = orchestrator.run(req.brand_id, req.prompt)
    return res

@app.post("/generate_campaign")
def generate_campaign(
    request: GenerationRequest,
    engine: TextEngine = Depends(get_engine)
):
    prompt = campaign_generator.build_prompt(request.prompt)

    output = engine.generate(
    brand_id=request.brand_id,
    prompt=prompt
    )

    campaign_store.save({
        "brand_id": request.brand_id,
        "prompt": request.prompt,
        "campaign": output
    })

    return {
        "campaign": output
    }

@app.get("/brands")
def list_brands():
    brands = brand_store.get_all()

    return {
        "brands": [
            b["brand_id"]
            for b in brands
        ]
    }

@app.get("/campaigns")
def list_campaigns():
    return {
        "campaigns": campaign_store.get_all()
    }