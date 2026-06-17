"use client";

import { useState } from "react";
import Toast from "@/components/ui/toast";
export default function BrandForm({
  onBrandCreated,
}: {
  onBrandCreated?: (brandId: string) => void;
}) {
  const [brandId, setBrandId] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  async function createBrand() {
    if (!brandId) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/register_brand",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand_id: brandId,
            config: {
              tone: "Professional",
              competitors: [],
              banned_words: [],
            },
          }),
        }
      );

      if (response.ok) {
        const createdBrand = brandId;

        setBrandId("");

        onBrandCreated?.(createdBrand);

        setToast(`${createdBrand} created successfully`);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
        }
    } catch (err) {
      setToast("Failed to create brand");
        setShowToast(true);

        setTimeout(() => {
        setShowToast(false);
        }, 3000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

return (
  <>
    <div className="mb-6 space-y-4">
      <input
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        placeholder="Brand ID"
        className="border rounded p-2 w-full"
      />

      <button
        onClick={createBrand}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Brand"}
      </button>
    </div>

    <Toast
      message={toast}
      show={showToast}
    />
  </>
);
}
