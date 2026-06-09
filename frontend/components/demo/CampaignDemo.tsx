"use client";

import { useState } from "react";
import { generateCampaign } from "@/lib/api";

export default function CampaignDemo() {

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  async function handleGenerate() {

    try {

      setLoading(true);

      const result = await generateCampaign(
        "nike",
        prompt
      );

      setText(result.text);
      setImage(result.image);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <section className="py-32">

      <h2 className="text-5xl font-bold mb-10">
        Live Demo
      </h2>

      <div className="grid md:grid-cols-2 gap-8">

        <div>

          <textarea
            className="
            w-full
            min-h-[200px]
            border
            rounded-xl
            p-4
            "
            placeholder="Create a Nike campaign for marathon runners..."
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
          />

          <button
            onClick={handleGenerate}
            className="
            mt-4
            border
            px-6
            py-3
            rounded-xl
            "
          >
            {loading
              ? "Generating..."
              : "Generate"}
          </button>

        </div>

        <div>

          <div className="border rounded-xl p-4">

            <h3 className="font-bold mb-4">
              Campaign Output
            </h3>

            <pre className="whitespace-pre-wrap">
              {text}
            </pre>

          </div>

          {image && (
            <img
              src={`http://localhost:8000/${image}`}
              alt="campaign"
              className="mt-6 rounded-xl"
            />
          )}

        </div>

      </div>

    </section>
  );
}
