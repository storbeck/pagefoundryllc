export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="text-2xl font-semibold leading-8">AI Readiness</h1>
        <p className="text-lg">
          I help teams integrate AI into their products and internal workflows
          in a practical way.
        </p>
        <p className="text-lg">
          I&apos;ve built custom MCP servers, retrieval systems backed by RAG
          databases, and structured context pipelines that connect models to
          real data. This includes embedding strategies, prompt design, and
          application-level integrations.
        </p>
        <p className="text-lg">
          Some engagements focus on adding AI directly into a product — search,
          summarization, assistance, or automation. Others focus on improving
          how engineers use AI in their day-to-day work.
        </p>
        <p className="text-lg">
          I&apos;ve written tailored repository context files, built internal
          tooling to support structured model interaction, and helped teams
          reduce noise and improve output quality when working with AI systems.
        </p>
        <p className="text-lg">
          I start with the actual need. If AI makes the system better, we
          implement it. If it doesn&apos;, we don&apos;t. The goal is usefulness, not
          surface-level features.
        </p>
      </div>
    </div>
  );
}