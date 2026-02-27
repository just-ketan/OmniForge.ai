from llama_cpp import Llama

llm = Llama(
    model_path="models/mistral-7b-instruct-v0.2.Q4_K_M.gguf",
    n_ctx=2048,
    n_threads=8,
)

output = llm(
    "Write a short premium marketing tagline for a sports brand.",
    max_tokens=100,
)

print(output["choices"][0]["text"])