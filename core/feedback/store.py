# get feedback and then fine tune the model

import json
import os
from datetime import datetime

class FeedbackStore:
    def __init__(self, path="data/feedback/feedback.json1"):
        self.path = path
        os.makedirs(os.path.dirname(self.path), exist_ok=True)

    def save(self, prompt, response, rating, brand_id=None):
        record = {
            "timestamp" : datetime.utcnow().isoformat(),
            "brand_id" : brand_id,
            "prompt" : prompt,
            "response" : response,
            "rating" : rating
        }

        with open(self.path, "a") as f:
            f.write(json.dumps(record)+"\n")
## the system writes {....... "rating" : "up/down"}
## this becomes future training data