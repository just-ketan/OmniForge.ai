from celery import Celery
from api.dependencies import get_engine

celery = Celery("omniforge", broker="redis://localhost:6379/0", backend='redis://localhost:6379/0')
engine = get_engine()

@celery.task
def generate_text_task(brand_id, prompt):
    return engine.generate(brand_id=brand_id, prompt=prompt)