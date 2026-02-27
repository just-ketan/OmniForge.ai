# OmniForge.ai — Build Steps (WSL + CPU + llama.cpp)

This document describes the complete build procedure for OmniForge Phase 1.

Environment Assumptions:
- WSL Ubuntu (noble or similar)
- CPU-only system
- Python 3.14 (college mirror)
- pip 26.x (mirror)
- GCC 13 installed
- No GPU

---

# 1️⃣ System Dependencies (One-Time Setup)

Inside WSL:

```bash
sudo apt update
sudo apt install build-essential cmake gcc g++ -y
```
## verufy compiler
```bash
gcc --version
g++ --version
cmake --version
```

# 2️⃣ Create Clean Virtual Environment

From project root:
```bash
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
```

Upgrade pip (do NOT force downgrade from mirror):
```bash
pip install --upgrade pip
```

# 3️⃣ Install Python Dependencies

⚠ Important: Force correct compiler override during llama build.
```bash
CC=gcc CXX=g++ pip install llama-cpp-python==0.3.16
```

Then install remaining dependencies:
```bash
pip install fastapi uvicorn pydantic
```

Verify llama:
```bash
python -c "from llama_cpp import Llama; print('LLAMA READY')"
```
Expected output:
LLAMA READY

# 4️⃣ Download Model (Mistral 7B Instruct Q4_K_M)

Create models directory:
```bash
mkdir -p models
cd models
```

Download model:
```bash
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf
```
Model size ≈ 4GB
Return to project root

# 5️⃣ Test Model Inference
Run:
```bash
python test_llama.py
```
If text is generated → build successful.