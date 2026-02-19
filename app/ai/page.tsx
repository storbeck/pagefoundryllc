import type { Metadata } from "next";
import Paragraph from "../components/paragraph";

export const metadata: Metadata = {
  title: "AI Readiness and Integration Consulting",
  description:
    "Practical AI consulting for product teams, including RAG pipelines, model integrations, and workflow automation tied to real business needs.",
  alternates: {
    canonical: "/ai",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <Paragraph title="AI Readiness">
          <div className="flex flex-col gap-6">
            <p className="text-base sm:text-lg">
              I help teams integrate AI into their products and internal workflows
              in a practical way.
            </p>
            <p className="text-base sm:text-lg">
              I&apos;ve built custom MCP servers, retrieval systems backed by RAG
              databases, and structured context pipelines that connect models to
              real data. This includes embedding strategies, prompt design, and
              application-level integrations.
            </p>
            <p className="text-base sm:text-lg">
              Some engagements focus on adding AI directly into a product — search,
              summarization, assistance, or automation. Others focus on improving
              how engineers use AI in their day-to-day work.
            </p>
            <p className="text-base sm:text-lg">
              I&apos;ve written tailored repository context files, built internal
              tooling to support structured model interaction, and helped teams
              reduce noise and improve output quality when working with AI systems.
            </p>
            <p className="text-base sm:text-lg">
              I start with the actual need. If AI makes the system better, we
              implement it. If it doesn&apos;t, we don&apos;t. The goal is usefulness, not
              surface-level features.
            </p>
          </div>
        </Paragraph>
      </div>
    </div>
  );
}
