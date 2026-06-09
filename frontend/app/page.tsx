import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Architecture from "@/components/landing/Architecture";
import Features from "@/components/landing/Features";
import CampaignDemo from "@/components/demo/CampaignDemo"

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6">

      <Hero />

      <Stats />

      <Architecture />

      <Features />

      <CampaignDemo />
    </main>
  );
}
