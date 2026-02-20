import type { Metadata } from "next";
import Image from "next/image";
import Paragraph from "../components/paragraph";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Geoff Storbeck across products, tools, and technical platforms.",
  alternates: {
    canonical: "/projects",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <Paragraph title="Featured Project">
        <article className="flex flex-col gap-5 rounded-xl border border-black/10 bg-black/[0.02] p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold leading-7 sm:text-xl sm:leading-8">
              DriftKing
            </h2>
            <p className="text-base sm:text-lg">
              DriftKing is a web app for frontend consistency. You log in,
              connect GitHub, scan repositories, and catch Tailwind class-token
              drift before it spreads across your codebase.
            </p>
          </div>

          <figure className="flex flex-col gap-2">
            <a
              href="/driftking-details.png"
              target="_blank"
              rel="noreferrer"
              title="Open full-size image"
            >
              <Image
                src="/driftking-details.png"
                alt="DriftKing product details and pricing section"
                width={1920}
                height={1080}
                className="h-auto w-full rounded-lg border border-black/10"
                priority
              />
            </a>
            <figcaption className="text-sm sm:text-base">
              Product detail view: feature explanation, trust cues, and a
              focused conversion path.
            </figcaption>
          </figure>

          <div className="flex flex-col gap-3 text-base sm:text-lg">
            <p>
              Why this exists: when teams ship fast, class usage drifts over
              time. You might standardize on <code>bg-blue-500</code>, then end
              up with <code>bg-indigo-500</code> and <code>bg-blue-400</code> in
              vibed code paths. DriftKing highlights that drift so the UI stays
              coherent.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-base sm:text-lg">
            <p className="font-semibold">How it works:</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Log in to DriftKing</li>
              <li>Connect your GitHub account and select a repo</li>
              <li>Run a scan to find class-token drift and inconsistency</li>
            </ol>
          </div>

          <p className="text-base font-semibold sm:text-lg">
            Live site:{" "}
            <a
              className="font-semibold underline decoration-2 underline-offset-2"
              href="https://driftking.dev/"
              target="_blank"
              rel="noreferrer"
            >
              driftking.dev
            </a>
          </p>
        </article>
      </Paragraph>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold sm:text-xl">Other Projects</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/quickcap.png"
              target="_blank"
              rel="noreferrer"
              title="Open full-size image"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <Image
                src="/quickcap.png"
                alt="QuickCap extension interface"
                width={420}
                height={240}
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
              />
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">QuickCap</h3>
              <p>
                Chrome extension that surfaces built-in screenshot actions at
                the top level: visible, full-page, area, and node capture.
              </p>
              <p>
                Uses CDP via extension debugger for advanced capture modes and
                auto-downloads timestamped PNGs.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/QuickCap"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/QuickCap
                </a>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/blog.png"
              target="_blank"
              rel="noreferrer"
              title="Open full-size image"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <Image
                src="/blog.png"
                alt="Storbeck.dev technical blog homepage"
                width={420}
                height={240}
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
              />
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">Storbeck.dev</h3>
              <p>
                Technical publishing platform built with Nuxt 4 and
                <code>@nuxt/content</code> with typed content collections and
                legacy URL redirects.
              </p>
              <p>
                Includes feed/SEO pipeline, demo pages, and lightweight server
                APIs for views/comments.
              </p>
              <p className="font-semibold">
                Live site:{" "}
                <a href="https://www.storbeck.dev/" target="_blank" rel="noreferrer">
                  storbeck.dev
                </a>
              </p>
            </div>
          </article>


          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/supply-chain-graph.png"
              target="_blank"
              rel="noreferrer"
              title="Open full-size image"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <Image
                src="/supply-chain-graph.png"
                alt="supply-chain-graph dependency visualization"
                width={420}
                height={240}
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
              />
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">supply-chain-graph</h3>
              <p>
                Smaller Python alternative to lockaudit: loads
                <code>package-lock.json</code> into LadybugDB so dependency
                relationships can be explored as a labeled property graph.
              </p>
              <p>
                Useful for quick graph-first dependency inspection without the
                full vulnerability enrichment pipeline.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/supply-chain-graph"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/supply-chain-graph
                </a>
              </p>
            </div>
          </article>


          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/buckhunt.gif"
              target="_blank"
              rel="noreferrer"
              title="Open full-size GIF"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <Image
                src="/buckhunt.gif"
                alt="buckhunt monitoring workflow GIF"
                width={420}
                height={240}
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
                unoptimized
              />
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">buckhunt</h3>
              <p>
                Client-facing cybersecurity utility for monitoring open S3
                buckets and surfacing exposures quickly.
              </p>
              <p>
                Built as a focused operational tool to speed detection workflows
                and reduce manual review effort.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/buckhunt"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/buckhunt
                </a>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/certwatch.mp4"
              target="_blank"
              rel="noreferrer"
              title="Open video in full view"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <video
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
                controls
                muted
                playsInline
              >
                <source src="/certwatch.mp4" type="video/mp4" />
              </video>
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">certwatch</h3>
              <p>
                Real-time Certificate Transparency (CT) log monitor for
                tracking SSL/TLS certificate issuance across the internet.
              </p>
              <p>
                Designed to surface newly issued certificates quickly so
                security researchers and administrators can monitor certificate
                activity as it happens.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/certwatch"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/certwatch
                </a>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/bait.mp4"
              target="_blank"
              rel="noreferrer"
              title="Open video in full view"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <video
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
                controls
                muted
                playsInline
              >
                <source src="/bait.mp4" type="video/mp4" />
                <source src="/bait.mov" type="video/quicktime" />
              </video>
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">bait</h3>
              <p>
                Go-based utility that generates realistic IT security alert
                voicemails by combining OpenAI GPT-4 content generation with
                ElevenLabs text-to-speech.
              </p>
              <p>
                Built for rapid security simulation workflows and high-quality
                alert message generation in test and training contexts.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/bait"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/bait
                </a>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/vulnex.png"
              target="_blank"
              rel="noreferrer"
              title="Open full-size image"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <Image
                src="/vulnex.png"
                alt="vulnex asset mapping screenshot"
                width={420}
                height={240}
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
              />
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">vulnex</h3>
              <p>
                Fast domain discovery and asset mapping tool that processes
                HackerOne program scopes and discovers related domains,
                endpoints, and web assets.
              </p>
              <p>
                Built to accelerate reconnaissance workflows by expanding known
                scope data into actionable infrastructure visibility.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/vulnex"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/vulnex
                </a>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/vulnrichment.png"
              target="_blank"
              rel="noreferrer"
              title="Open full-size image"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <Image
                src="/vulnrichment.png"
                alt="vulnrichment-cli screenshot"
                width={420}
                height={240}
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
              />
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">vulnrichment-cli</h3>
              <p>
                CLI that fetches enriched CVE records directly from the CISA
                Vulnrichment GitHub repository.
              </p>
              <p>
                It can also generate a Markdown report for a given CVE to speed
                triage, documentation, and handoff.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/vulnrichment-cli"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/vulnrichment-cli
                </a>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 border border-black/10 bg-black/[0.02] p-3 text-sm md:col-span-2 md:flex-row md:items-start">
            <a
              href="/ytpod.mp4"
              target="_blank"
              rel="noreferrer"
              title="Open video in full view"
              className="block md:h-[180px] md:w-[320px] md:shrink-0"
            >
              <video
                className="h-auto w-full border border-black/10 bg-black/[0.03] md:h-[180px] md:w-[320px] md:object-contain"
                controls
                muted
                playsInline
              >
                <source src="/ytpod.mp4" type="video/mp4" />
                <source src="/ytpod.mov" type="video/quicktime" />
              </video>
            </a>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">ytpod</h3>
              <p>
                Tiny iPod-style desktop player for YouTube playlists and
                searches with no API key required.
              </p>
              <p>
                Built for lightweight listening workflows with familiar hardware
                inspired interaction patterns.
              </p>
              <p className="font-semibold">
                GitHub:{" "}
                <a
                  href="https://github.com/storbeck/ytpod"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/storbeck/ytpod
                </a>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
