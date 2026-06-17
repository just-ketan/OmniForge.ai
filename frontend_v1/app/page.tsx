import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CampaignForm from "@/components/dashboard/campaign-form";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1">
        <Header />

        <div className="p-8">
          <h1 className="text-4xl font-bold">
            OmniForge.ai
          </h1>

          <p className="mt-4 text-muted-foreground">
            AI-powered brand intelligence and campaign generation.
          </p>

          <CampaignForm />

          <Link
            href="/campaigns"
            className="inline-block mt-6 rounded-lg bg-black px-4 py-2 text-white"
          >
            Open Campaign Generator
          </Link>

        </div>
      </main>
    </div>
  );
}
