import type { Metadata } from "next";
import Paragraph from "../components/paragraph";

export const metadata: Metadata = {
  title: "Application Development Consulting",
  description:
    "Application development consulting for React and TypeScript products, from legacy modernization to scalable frontend architecture.",
  alternates: {
    canonical: "/appdev",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <Paragraph title="Application Development">
          <div className="flex flex-col gap-6">
            <p className="text-base sm:text-lg">
              I build and maintain web applications used in production environments.
            </p>
            <p className="text-base sm:text-lg">
              Most of my work has involved stepping into existing systems,
              understanding how they function, and improving them without disrupting
              delivery. I&apos;m comfortable working in codebases that have history.
              I focus on making them more structured, more predictable, and easier
              to extend.
            </p>
            <p className="text-base sm:text-lg">
              I work primarily in React and TypeScript. I&apos;ve built large
              frontends, rewritten legacy applications, and created standalone
              systems that connect cleanly to backend services. I pay attention to
              state management, API boundaries, and how components are organized so
              that the application can grow without becoming difficult to maintain.
            </p>
            <p className="text-base sm:text-lg">
              I&apos;ve also built internal tools and dashboards that interact with
              infrastructure systems, databases, and cloud services. These types of
              applications usually involve data-heavy interfaces, operational
              workflows, and real constraints around performance and deployment.
            </p>
            <p className="text-base sm:text-lg">
              Outside of the browser, I&apos;ve written backend utilities and services
              in Go and Node. I&apos;ve built small servers, CLI tools, and automation scripts.
              Earlier in my career I worked in system administration, which means I&apos;m used
              to thinking about how software behaves in production, during deployment, failure handling,
              and long-term maintenance.
            </p>
          </div>
        </Paragraph>
      </div>
    </div>
  );
}
