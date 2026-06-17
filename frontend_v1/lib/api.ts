const API_URL = "http://localhost:8000";

export async function generateCampaign(
  brand_id: string,
  prompt: string
) {
  const response = await fetch(
    `${API_URL}/generate_campaign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand_id,
        prompt,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Generation failed");
  }

  return response.json();
}
