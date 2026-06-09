# vision engine wrapper
import os
from .diffusion import DiffusionEngine

class VisionEngine:
    def __init__(self):
        self.diffusion = DiffusionEngine()
        os.makedirs("outputs", exist_ok=True)

    def generate(self, brand_id:str, query:str):
        image = self.diffusion.generate(query)
        path = f"outputs/{brand_id}_image.png"
        image.save(path)
        return path