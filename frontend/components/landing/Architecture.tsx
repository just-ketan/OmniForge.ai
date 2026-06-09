"use client";

import { motion } from "framer-motion";

const nodes = [
  "User Prompt",
  "Planner Agent",
  "Brand RAG",
  "Compliance",
  "Mistral 7B",
  "Vision Engine",
  "Campaign Output"
];

export default function Architecture() {
  return (
    <section className="py-32">

      <h2 className="text-5xl font-bold text-center mb-16">
        Multi-Agent Workflow
      </h2>

      <div className="flex flex-col items-center gap-4">

        {nodes.map((node, idx) => (
          <motion.div
            key={node}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="
              border
              rounded-xl
              px-8
              py-4
              w-[320px]
              text-center
            "
          >
            {node}
          </motion.div>
        ))}

      </div>

    </section>
  );
}
