import json
class DatasetBuilder:
    def __init__(self, feedback_file="data/feedback/feedback.json1"):
        self.feedback_file = feedback_file

    def build_dataset(self, output_path="data/training/lora_dataset.json1"):
        with open(self.feedback_file) as f:
            lines = f.readlines()
        
        dataset = []
        for line in lines:
            record = json.loads(line)
            if record["rating"] == "up":
                dataset.append({
                    "instruction" : record["prompt"],
                    "output" : record["response"]
                })
        
        with open(output_path, "w") as f:
            for item in dataset:
                f.write(json.dumps(item)+"\n")
        return len(dataset)
    
### converts feedback into training data

