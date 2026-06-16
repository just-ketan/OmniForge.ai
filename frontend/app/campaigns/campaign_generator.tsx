"use client";

import { useEffect, useState } from "react";

export default function CampaignGenerator() {
  const [brands, setBrands] = useState<string[]>([]);
  const [brandId, setBrandId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [campaign, setCampaign] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.brands || []);
      });
  }, []);

  async function generateCampaign() {
    setCampaign("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate_stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand_id: brandId,
            prompt,
          }),
        }
      );

      const reader =
        response.body?.getReader();

      if (!reader) return;

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });
        console.log("chunk:", chunk);
        await new Promise((resolve) =>
          setTimeout(resolve, 0)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

    return (
        <div className="space-y-4">

            <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                Brands
                </p>
                <p className="text-2xl font-bold">
                {brands.length}
                </p>
            </div>

            <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                Status
                </p>
                <p className="text-2xl font-bold">
                Ready
                </p>
            </div>

            <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                Engine
                </p>
                <p className="text-2xl font-bold">
                Local AI
                </p>
            </div>
            </div>

            <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="border p-2 rounded w-full"
            >
        <option value="">
          Select Brand
        </option>

        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Campaign Prompt"
        className="border p-2 rounded w-full h-32"
      />

      {loading && (
        <p className="text-sm text-gray-500">
          AI is writing...
        </p>
      )}

      <button
        onClick={generateCampaign}
        disabled={loading}
      >
        {loading
          ? "Streaming..."
          : "Generate Campaign"}
      </button>

      {campaign && (
        <div className="border rounded p-4">
            <h2 className="font-bold mb-4">
            Generated Campaign
            </h2>

            <div className="flex gap-2 mb-4">
            <button
                onClick={() =>
                navigator.clipboard.writeText(campaign)
                }
                className="px-3 py-1 border rounded"
            >
                Copy
            </button>

            <button
                onClick={() => {
                const blob = new Blob([campaign], {
                    type: "text/plain",
                });

                const url =
                    URL.createObjectURL(blob);

                const a =
                    document.createElement("a");

                a.href = url;
                a.download =
                    `${brandId}-campaign.txt`;

                a.click();

                URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 border rounded"
            >
                Download
            </button>
            </div>

            <p className="whitespace-pre-wrap">
            {campaign}
            </p>
        </div>
        )}
    </div>
  );
}