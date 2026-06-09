# loads style adapters for brands

import os
class VisionLoRA:
    def __init__(self, pipe):
        self.pipe = pipe

    def load_brand_style(self, brand_id):
        path = f"models/vision_lora/{brand_id}"
        if os.path.exists(path):
            self.pipe.load_lora_weights(path)