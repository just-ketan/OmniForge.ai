import json
import os

class CampaignStore:
    def __init__(self):
        self.path = "data/campaigns.json"

        os.makedirs("data", exist_ok=True)

        if not os.path.exists(self.path):
            with open(self.path, "w") as f:
                json.dump([], f)

    def save(self, campaign):
        campaigns = self.get_all()

        campaigns.append(campaign)

        with open(self.path, "w") as f:
            json.dump(campaigns, f, indent=2)

    def get_all(self):
        try:
            with open(self.path, "r") as f:
                content = f.read().strip()

                if not content:
                    return []

                return json.loads(content)

        except (FileNotFoundError, json.JSONDecodeError):
            return []