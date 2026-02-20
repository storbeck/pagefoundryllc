import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWritingPostBySlug, writingConfigs } from "@/lib/writing";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return writingConfigs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingPostBySlug(slug);

  if (!post) {
    return {
      title: "Writing Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/writing/${post.slug}`,
    },
  };
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getWritingPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-8 pb-8">
      <header className="flex flex-col gap-3">
        <h1 className="writing-title">{post.title}</h1>
      </header>

      <section
        className="insight-section writing-body py-4"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />
    </article>
  );
}
