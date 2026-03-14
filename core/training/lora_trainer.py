import subprocess

class LoRATrainer:
    def train(self, dataset_path, output_dir):
        cmd = [
            "python",
            "finetune.py",
            "--dataset", dataset_path,
            "--output", output_dir
        ]
        subprocess.run(cmd)

### we can plug thuis into HuggingFace PRFT, Axolotl, LLaMA-Factory