# classifier to classify the sections as general/product/...

class SectionClassifier:
    def classify(self, text):
        text_lower = text.lower()
        if any(word in text_lower for word in ["shoe", "product","model"]):
            return "product"
        if any(word in text_lower for word in ["feature", "technology", "design"]):
            return "features"
        if any(word in text_lower for word in ["marketing", "campaign", "launch"]):
            return "marketing"
        if any(word in text_lower for word in ["brand", "voice", "tone"]):
            return "brand_voice"
        if any(word in text_lower for word in ["guideline", "rule", "policy"]):
            return "guidelines"
        return "general"    # default