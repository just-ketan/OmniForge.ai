"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";


export default function CampaignsPage() {
  const [brandId, setBrandId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://127.0.0.1:8000/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.brands || []);
      })
      .catch(console.error);
  }, []);

  async function generateCampaign() {
    setLoading(true);
    setResult("");
    setError("");

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

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("No stream reader");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk = decoder.decode(
          value,
          { stream: true }
        );

        setResult((prev) => prev + chunk);
      }
    } catch (err) {
      setError("Campaign generation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1">
        <Header />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Campaign Generator
          </h1>

          <select
            className="border rounded p-2 w-full mb-4"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            <option value="">
              Select a Brand
            </option>

            {brands.map((brand) => (
              <option
                key={brand}
                value={brand}
              >
                {brand}
              </option>
            ))}
          </select>

          <textarea
            className="border rounded p-2 w-full mb-4"
            rows={6}
            placeholder="Campaign Brief"
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
          />

          <button
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            onClick={generateCampaign}
            disabled={!brandId || loading}
          >
            {loading ? "Streaming..." : "Generate"}
          </button>

          {loading && (
            <p className="text-gray-500 mb-3">
              AI is writing...
            </p>
          )}
          
          {result && (
            <div className="mt-6">
              <button
                className="mb-3 px-3 py-1 border rounded"
                onClick={() => navigator.clipboard.writeText(result)}
              >
                Copy Campaign
              </button>
              <button
                className="mb-3 ml-2 px-3 py-1 border rounded"
                onClick={() => {
                  const blob = new Blob([result], {
                    type: "text/plain",
                  });

                  const url = URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${brandId}-campaign.txt`;

                  document.body.appendChild(a);
                  a.click();

                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Download Campaign
              </button>
              {error && (
                <div className="mt-4 p-3 border rounded text-red-500">
                  {error}
                </div>
              )}
              <pre className="whitespace-pre-wrap border rounded p-4">
                {result}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}