import json
import os

class BrandStore:
    def __init__(self):
        self.path = "data/brands.json"

        os.makedirs("data", exist_ok=True)

        if not os.path.exists(self.path):
            with open(self.path, "w") as f:
                json.dump([], f)

    def save(self, brand):
        brands = self.get_all()

        brands.append(brand)

        with open(self.path, "w") as f:
            json.dump(brands, f, indent=2)

    def get_all(self):
        try:
            with open(self.path, "r") as f:
                return json.load(f)
        except:
            return []