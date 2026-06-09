# stable diffusion pipeline
from diffusers import StableDiffusionPipeline
import torch

from .vae import VAE

class DiffusionEngine:
    def __init__(self):
        self.vae = VAE()
        self.pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", vae=self.vae.model , torch_dtype=torch.float32)
        self.pipe.to("cpu") # guide model to CPU based generation

    def generate(self, prompt):
        image = self.pipe(prompt).images[0]
        return image
    