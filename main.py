engine = TextEngine(
    model_path="models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
)

engine.register_brand(
    brand_id="nike",
    config={
        "brand_name": "Nike",
        "tone": "Bold and inspirational",
        "style": "High-performance and premium",
        "audience": "Serious athletes",
        "banned_words": ["cheap"],
        "competitors": ["Adidas"],
        "temperature": 0.6,
        "top_p": 0.9,
        "max_tokens": 150,
    },
    knowledge_path="data/raw/nike_brand_guidelines.pdf",  # optional added knowledge path
)

response = engine.generate(
    "nike",
    "Write a product launch post for our new carbon marathon shoe."
)

print(response)