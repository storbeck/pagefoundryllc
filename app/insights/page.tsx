import type { Metadata } from "next";
import Link from "next/link";
import { insightPosts } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Frontend engineering insights for SaaS founders and product teams, focused on architecture, UX clarity, and delivery speed.",
  alternates: {
    canonical: "/insights",
  },
};

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="flex flex-col gap-3">
        <span className="section-kicker">Insights</span>
        <h1>Engineering insights for SaaS product teams</h1>
        <p className="max-w-3xl">
          Republished and adapted from storbeck.dev for founders, product
          managers, and engineering leads evaluating frontend execution.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        {insightPosts.map((post) => (
          <article key={post.slug} className="insight-card p-4">
            <p className="insight-meta">{post.publishedDate}</p>
            <h2 className="mt-1">
              <Link href={`/insights/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 max-w-3xl">{post.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
