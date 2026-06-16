import { Brain, Search, Database, Image } from "lucide-react";

const features = [
  {
    title: "Agentic Workflow",
    icon: Brain,
    desc: "Planner + Retrieval + Generation orchestration"
  },
  {
    title: "Hybrid Retrieval",
    icon: Search,
    desc: "BM25 + Vector Search + Cross Encoder"
  },
  {
    title: "Knowledge Base",
    icon: Database,
    desc: "Brand-specific isolated RAG pipelines"
  },
  {
    title: "Visual Generation",
    icon: Image,
    desc: "AI generated campaign creatives"
  }
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="grid md:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="border rounded-2xl p-6"
          >
            <f.icon className="mb-4" />
            <h3 className="font-bold">{f.title}</h3>
            <p className="text-gray-500 mt-2">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
