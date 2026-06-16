"use client";
import BrandForm from "@/components/brands/brand-form";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function BrandsPage() {
  const [brands, setBrands] = useState<string[]>([]);

const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("http://127.0.0.1:8000/brands")
    .then((res) => res.json())
    .then((data) => setBrands(data.brands || []))
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1">
        <Header />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Brands
          </h1>
          <BrandForm
            onBrandCreated={(newBrand) => {
              setBrands((prev) => [...prev, newBrand]);
            }}
          />
          <div className="space-y-3">
            {loading ? (
              <p>Loading brands...</p>
            ) : brands.length === 0 ? (
              <p>No brands registered yet.</p>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand}
                  className="rounded-lg border p-4"
                >
                  {brand}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}