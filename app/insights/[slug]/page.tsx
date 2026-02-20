import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsightPostBySlug, insightPosts } from "@/lib/insights";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return insightPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightPostBySlug(slug);

  if (!post) {
    return {
      title: "Insight Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/insights/${post.slug}`,
    },
  };
}

export default async function InsightPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getInsightPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-8 pb-8">
      <header className="flex flex-col gap-3">
        <span className="section-kicker">Insight</span>
        <h1>{post.title}</h1>
        <p className="insight-meta">{post.publishedDate}</p>
        <p className="max-w-3xl">{post.intro}</p>
      </header>

      <section className="flex flex-col gap-5">
        {post.sections.map((section) => (
          <div key={section.heading} className="insight-section">
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-2 max-w-3xl">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </section>

      <section className="insight-section p-4">
        <h2>Key Takeaways</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {post.takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </section>

      <section className="insight-section p-4">
        <h2>Need help applying this to your product?</h2>
        <p className="mt-2 max-w-3xl">
          I work with SaaS teams on greenfield architecture, frontend
          modernization, and UX clarity. Reach out and I can review your current
          constraints and suggest a practical execution plan.
        </p>
        <p className="mt-2">
          Contact: <a href="mailto:geoff@pagefoundry.dev">geoff@pagefoundry.dev</a>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <p className="insight-meta">
          Original version:
          {" "}
          <a href={`https://www.storbeck.dev/posts/${post.originalSlug}`}>
            storbeck.dev/posts/{post.originalSlug}
          </a>
        </p>
        <Link href="/insights">Back to all insights</Link>
      </section>
    </article>
  );
}
