"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="py-32 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl font-bold"
      >
        OmniForge.ai
      </motion.h1>

      <p className="mt-8 text-xl text-gray-500 max-w-3xl mx-auto">
        Multi-Agent Brand Intelligence Platform powered by
        Local LLMs, Hybrid RAG, Knowledge Retrieval,
        Campaign Generation and AI Content Creation.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <button className="px-6 py-3 rounded-xl bg-black text-white">
          Try Demo
        </button>

        <button className="px-6 py-3 rounded-xl border">
          View Architecture
        </button>
      </div>
    </section>
  );
}
