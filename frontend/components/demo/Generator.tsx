"use client";

import { useState } from "react";
import { generateCampaign } from "@/lib/api";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    try {
      const data = await generateCampaign(
        "nike",
        prompt
      );

      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Create a Nike campaign for Gen-Z runners"
        className="w-full border rounded-xl p-4"
      />

      <button
        onClick={handleGenerate}
        className="mt-4 px-6 py-3 rounded-xl bg-black text-white"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <pre className="mt-8 p-4 rounded-xl bg-gray-100 overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
