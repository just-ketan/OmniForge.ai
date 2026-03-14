import os
from peft import PeftModel

class AdapterLoader:
    def __init__(self, base_model):
        self.base_model = base_model
        self.loaded_adapters = {}

    def load_adapter(self, brand_id):
        adapter_path = f"models/lora/{brand_id}"
        if not os.path.exists(adapter_path):
            return self.base_model
        if brand_id in self.loaded_adapters:
            return self.loaded_adapters[brand_id]
        
        #peft model for LoRA loading
        model = PeftModel.from_pretrained(self.base_model, adapter_path)
        self.loaded_adapters[brand_id]=model

        return model