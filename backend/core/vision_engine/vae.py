# handles image encoding/decoding
# latent -> image and for image -> latent mapping

from diffusers import AutoencoderKL
class VAE:
    def __init__(self):
        self.model = AutoencoderKL.from_pretrained("stabilityai/sd-vae-ft-mse")
    
    def encode(self, image):
        return self.model.encode(image)
    
    def decode(self, latent):
        return self.model.decode(latent)