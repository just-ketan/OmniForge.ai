"use client";

export default function Stats() {

  const stats = [
    ["5", "AI Agents"],
    ["7B", "LLM Parameters"],
    ["Hybrid", "RAG Engine"],
    ["SD", "Image Generation"],
  ];

  return (
    <section className="py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {stats.map(([value,label]) => (
          <div key={label} className="text-center">
            <h2 className="text-4xl font-bold">{value}</h2>
            <p className="text-muted-foreground">{label}</p>
          </div>
        ))}

      </div>
    </section>
  );
}
