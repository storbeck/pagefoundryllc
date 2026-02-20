import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

type WritingConfig = {
  slug: string;
  sourceFile: string;
  sourceSlug: string;
  title: string;
};

export type WritingPost = {
  slug: string;
  sourceSlug: string;
  title: string;
  description: string;
  publishedDate: string;
  bodyHtml: string;
};

export const writingConfigs: WritingConfig[] = [
  {
    slug: "why-saas-products-feel-confusing-even-with-correct-backends",
    sourceFile: "why-your-design-sucks.md",
    sourceSlug: "why-your-design-sucks",
    title: "Why SaaS Products Feel Confusing Even When the Backend Is Correct",
  },
  {
    slug: "reducing-frontend-latency-by-collapsing-chatty-request-chains",
    sourceFile: "collapse-6-fetches-into-1.md",
    sourceSlug: "collapse-6-fetches-into-1",
    title: "How We Reduced Frontend Latency by Collapsing Chatty Request Chains",
  },
  {
    slug: "automating-usability-checks-in-ci-with-playwright",
    sourceFile: "playwright-automated-usability-testing.md",
    sourceSlug: "playwright-automated-usability-testing",
    title: "Automating Usability Checks in CI with Playwright",
  },
  {
    slug: "derisking-frontend-modernization-by-removing-dead-code-first",
    sourceFile: "remove-dead-code-with-knip.md",
    sourceSlug: "remove-dead-code-with-knip",
    title: "De-Risking Frontend Modernization by Removing Dead Code First",
  },
  {
    slug: "from-generic-ui-to-intentional-design-reference-driven-workflow",
    sourceFile: "design-prompts-references.md",
    sourceSlug: "design-prompts-references",
    title: "From Generic UI to Intentional Design: A Reference-Driven Workflow",
  },
  {
    slug: "frontend-quality-is-layered-work-not-surface-polish",
    sourceFile: "bodywork-and-interfaces.md",
    sourceSlug: "bodywork-and-interfaces",
    title: "Frontend Quality Is Layered Work, Not Surface Polish",
  },
];

function stripQuotes(input: string): string {
  const value = input.trim();
  return value.replace(/^"(.*)"$/, "$1").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderCodeFences(body: string): string {
  return body.replace(
    /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
    (_match, language: string, code: string) => {
      const langClass = language ? ` class="language-${language}"` : "";
      const escaped = escapeHtml(code.trimEnd());
      return `<pre><code${langClass}>${escaped}</code></pre>`;
    },
  );
}

function parsePost(raw: string): { description: string; date: string; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { description: "", date: "", body: renderCodeFences(raw) };
  }

  const [, frontmatter, body] = match;
  let description = "";
  let date = "";

  for (const line of frontmatter.split("\n")) {
    if (line.startsWith("description:")) {
      description = stripQuotes(line.replace("description:", ""));
    }
    if (line.startsWith("date:")) {
      date = stripQuotes(line.replace("date:", ""));
    }
  }

  return { description, date, body: renderCodeFences(body) };
}

async function loadPost(config: WritingConfig): Promise<WritingPost> {
  const filePath = path.join(process.cwd(), "content", "writing", config.sourceFile);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = parsePost(raw);

  return {
    slug: config.slug,
    sourceSlug: config.sourceSlug,
    title: config.title,
    description: parsed.description,
    publishedDate: parsed.date,
    bodyHtml: parsed.body.trim(),
  };
}

export const getWritingPosts = cache(async (): Promise<WritingPost[]> => {
  const posts = await Promise.all(writingConfigs.map(loadPost));
  return posts.sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
});

export const getWritingPostBySlug = cache(
  async (slug: string): Promise<WritingPost | undefined> => {
    const posts = await getWritingPosts();
    return posts.find((post) => post.slug === slug);
  },
);
