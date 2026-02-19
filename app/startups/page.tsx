import type { Metadata } from "next";
import Image from "next/image";
import Paragraph from "../components/paragraph";

export const metadata: Metadata = {
  title: "Micro Startups",
  description:
    "Micro startups built by Geoff Storbeck. Shipping products continuously and iterating toward product-market fit.",
  alternates: {
    canonical: "/startups",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <Paragraph title="Featured Launch">
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
            <Image
              src="/driftking-details.png"
              alt="DriftKing product details and pricing section"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-lg border border-black/10"
              priority
            />
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
    </div>
  );
}
