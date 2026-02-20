import type { Metadata } from "next";
import Link from "next/link";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Frontend engineering writing for SaaS founders and product teams, focused on architecture, UX clarity, and delivery speed.",
  alternates: {
    canonical: "/writing",
  },
};

export default async function WritingPage() {
  const posts = await getWritingPosts();

  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="flex flex-col gap-3 px-4">
        <span className="section-kicker">Writing</span>
        <h1 className="writing-title">
          Frontend strategy and delivery notes for product teams
        </h1>
        <p className="max-w-3xl">
          Practical essays on frontend architecture, UX clarity, and shipping
          faster with less rework.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        {posts.map((post) => (
          <article key={post.slug} className="insight-card p-4">
            <h2 className="writing-card-title">
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 max-w-3xl">{post.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
