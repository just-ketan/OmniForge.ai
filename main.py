from core.text_engine.engine import TextEngine

engine = TextEngine(
    model_path="models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
)

engine.register_brand(
    "nike",
    {
        "brand_name": "Nike",
        "tone": "Bold and inspirational",
        "style": "High-performance and premium",
        "audience": "Serious athletes",
        "banned_words": ["cheap"],
        "competitors": ["Adidas"],
        "temperature": 0.6,
        "top_p": 0.9,
        "max_tokens": 120,
    },
)

print("\n--- BASIC GENERATION ---\n")

response = engine.generate(
    "nike",
    "Write a LinkedIn launch post for our new marathon racing shoe."
)

print(response)