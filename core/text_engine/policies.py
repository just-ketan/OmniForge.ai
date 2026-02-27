from typing import List, Dict

class BrandPolicy:
    # encapsulates brand specific generation constraints
    def __init__(self, config: Dict):
        self.banned_words:List[str] = config.get("banned_words",[])
        self.competitors: List[str] = config.get("competitors", [])
        self.temperature: float = config.get("temperature",0.7)
        self.top_p: float = config.get("top_p", 0.9)
        self.deterministic: bool = config.get("deterministic", False)
        self.max_tokens = config.get("max_tokens", 300)
    
    def get_effective_temperature(self) -> float:
        #if deterministic return 0.0
        if self.deterministic:
            return 0.0
        return self.temperature

    def get_effective_top_p(self) -> float:
        #if deterministic return 1.0
        if self.deterministic:
            return 1.0
        return self.top_p