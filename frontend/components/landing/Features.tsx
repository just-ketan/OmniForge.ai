import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Multi-Agent Planning",
    desc: "Planner, Retriever and Generator agents collaborate."
  },
  {
    title: "Hybrid RAG",
    desc: "Vector search + BM25 + reranking."
  },
  {
    title: "Brand Memory",
    desc: "Persistent company knowledge and guidelines."
  },
  {
    title: "Creative Generation",
    desc: "Stable Diffusion powered marketing creatives."
  }
];

export default function Features() {
  return (
    <section className="py-32">

      <h2 className="text-5xl font-bold text-center mb-16">
        Core Capabilities
      </h2>

      <div className="grid md:grid-cols-2 gap-8">

        {features.map((feature) => (
          <Card key={feature.title} className="p-8">
            <h3 className="text-2xl font-bold">
              {feature.title}
            </h3>

            <p className="mt-4 text-muted-foreground">
              {feature.desc}
            </p>
          </Card>
        ))}

      </div>

    </section>
  );
}
