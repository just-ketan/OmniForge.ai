"use client";

import { useState } from "react";

export default function CampaignForm() {
  const [brandId, setBrandId] = useState("nike");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateCampaign() {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand_id: brandId,
        prompt,
      }),
    });

    const data = await res.json();

    setOutput(data.output);
    setLoading(false);
  }

  return (
    <div className="mt-8 space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Brand ID"
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        rows={6}
        placeholder="Campaign prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generateCampaign}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {output && (
        <div className="border rounded p-4 whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}