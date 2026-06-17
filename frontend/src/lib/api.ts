const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export interface BrandConfig {
  tone: string;
  competitors: string[];
  banned_words: string[];
}

export interface CampaignRecord {
  brand_id: string;
  prompt: string;
  campaign: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    if (init?.method && init.method !== "GET") {
      throw new Error("VITE_API_URL is not configured");
    }
    return (path === "/brands" ? { brands: [] } : { campaigns: [] }) as T;
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/"),
  getBrands: () => request<{ brands: string[] }>("/brands"),
  registerBrand: (brand_id: string, config: BrandConfig) =>
    request<{ message: string }>("/register_brand", {
      method: "POST",
      body: JSON.stringify({ brand_id, config }),
    }),
  generateCampaign: (brand_id: string, prompt: string) =>
    request<{ campaign: string }>("/generate_campaign", {
      method: "POST",
      body: JSON.stringify({ brand_id, prompt }),
    }),
  getCampaigns: () => request<{ campaigns: CampaignRecord[] }>("/campaigns"),
  feedback: (payload: { brand_id: string; prompt: string; response: string; rating: number }) =>
    request<{ message?: string }>("/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  async generateStream(
    brand_id: string,
    prompt: string,
    onToken: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    if (!API_URL) throw new Error("VITE_API_URL is not configured");
    const res = await fetch(`${API_URL}/generate_stream`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brand_id, prompt }),
      signal,
    });
    if (!res.ok || !res.body) throw new Error(`${res.status} ${res.statusText}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      onToken(chunk);
    }
    return full;
  },
};

export const queryKeys = {
  brands: ["brands"] as const,
  campaigns: ["campaigns"] as const,
};