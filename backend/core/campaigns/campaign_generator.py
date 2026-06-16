class CampaignGenerator:

    def build_prompt(self, brief: str) -> str:
        return f"""
You are a senior marketing strategist.

Generate:

1. Headline
2. Tagline
3. LinkedIn Post
4. Email Subject
5. Email Body
6. CTA

Campaign Brief:
{brief}

Return clearly separated sections.
"""
