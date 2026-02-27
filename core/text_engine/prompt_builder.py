class PromptBuilder:
    def __init__(self, brand_config:dict):
        self.brand_name = brand_config.get("brand_name", "Brand")
        self.tone = brand_config.get("tone", "Professional")
        self.style = brand_config.get("style", "Premium")
        self.audience = brand_config.get("audience", "General audience")
    
    def build(self, user_prompt:str) -> str:
        system_instruction = f"""
            you are a senior marketing copywriter for  {self.brand_name}.
            Tone : {self.tone}
            Style : {self.style}
            Target Audience : {self.audience}

            Generate high-quality marketing copy.
            Be concise.
            Avoid generic phrasing. 
            Do not mention competitors. 
            """
        full_prompt = f"<S>[INST] {system_instruction.strip()}\n\nUser Request:\n{user_prompt.strip()} [/INST]"
        return full_prompt