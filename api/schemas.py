# define API schemas
from pydantic import BaseModel
from typing import Optional, Dict

class BrandRegistration(BaseModel):
    brand_id : str
    config : Dict
    knowledge_path : Optional[str] = None

class GenerationRequest(BaseModel):
    brand_id : str
    prompt : str

class GenerateResponse(BaseModel):
    output: str

# schemas makes the API "typed" and "safe"