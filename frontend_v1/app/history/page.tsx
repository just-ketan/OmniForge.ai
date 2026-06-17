"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

interface Campaign {
  brand_id: string;
  prompt: string;
  campaign: string;
}

export default function HistoryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] =
  useState<Campaign | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || []);
      })
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
            Campaign History
          </h1>
          <p className="text-gray-500 mb-6">
            {campaigns.length} campaigns generated
          </p>
          {loading && (
            <p>Loading campaigns...</p>
          )}

          {!loading && campaigns.length === 0 && (
            <p>No campaigns generated yet.</p>
          )}

          <div className="space-y-4">
            {[...campaigns]
            .reverse()
            .map((campaign, index) => (
              <div
                key={index}
                className="border rounded-lg p-5 bg-white shadow-sm"
              >
                <div className="mb-3">
                  <h2 className="font-semibold text-lg">
                    {campaign.brand_id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {campaign.prompt}
                  </p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm">
                    {campaign.campaign.slice(0, 250)}...
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSelectedCampaign(campaign)
                  }
                  className="mt-3 ml-2 px-3 py-1 border rounded"
                >
                  View Full Campaign
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      campaign.campaign
                    );

                    alert("Campaign copied!");
                  }}
                  className="mt-3 px-3 py-1 border rounded"
                >
                  Copy Campaign
                </button>
              </div>
            ))}
          </div>
          
        </div>
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">

              <h2 className="text-2xl font-bold mb-2">
                {selectedCampaign.brand_id}
              </h2>

              <p className="text-gray-500 mb-4">
                {selectedCampaign.prompt}
              </p>

              <div className="border rounded p-4 whitespace-pre-wrap">
                {selectedCampaign.campaign}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      selectedCampaign.campaign
                    )
                  }
                  className="px-3 py-1 border rounded"
                >
                  Copy
                </button>

                <button
                  onClick={() =>
                    setSelectedCampaign(null)
                  }
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}