from pydantic import BaseModel

class FeedbackRequest(BaseModel):
    brand_id : str
    prompt : str
    response : str
    rating : str