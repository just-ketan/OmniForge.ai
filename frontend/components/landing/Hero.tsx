"use client";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-8">

      <div className="max-w-5xl">

        <div className="text-sm border rounded-full px-4 py-2 inline-block mb-6">
          Multi-Agent AI Marketing Platform
        </div>

        <h1 className="text-7xl font-bold tracking-tight">
          OmniForge AI
        </h1>

        <p className="text-2xl text-muted-foreground mt-6">
          Enterprise-grade AI platform that combines
          Multi-Agent Planning,
          Brand Memory,
          Hybrid RAG,
          LLM Generation,
          and AI Creative Production.
        </p>

        <div className="mt-10 flex gap-4 justify-center">

          <Button size="lg">
            Try Demo
          </Button>

          <Button variant="outline" size="lg">
            View Architecture
          </Button>

        </div>

      </div>

    </section>
  );
}
