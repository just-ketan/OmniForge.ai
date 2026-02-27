# LLama doesnt soppoer HF style LogitsProcessor directly
# so we implement post-generation filtering + early stopping strategy for CPU phase
# for GPU we can upgrade to tru logits suppression

import re
from typing import List

class OutputFilter:
    # post generation safety enforcement. sanitise after generation fro CPU, for GPU we replacce with true logit biasing

    def __init__(self, banned_words:List[str]):
        self.banned_words = banned_words
    
    def has_violation(self, text:str) -> bool:
        for word in self.banned_words:
            pattern = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
            if(pattern.search(word)):
                return True
        return False
    
    def sanitize(self, text:str) ->str:
        # replace banned words with redacted tokens
        sanitized = text
        for word in self.banned_words:
            pattern = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
            sanitized = pattern.sub("[REDACTED]", sanitized)
        
        return sanitized
