export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold leading-8">
          Application Development
        </h1>
        <p className="text-lg">
          I build and maintain web applications used in production environments.
        </p>
        <p className="text-lg">
          Most of my work has involved stepping into existing systems,
          understanding how they function, and improving them without disrupting
          delivery. I&apos;m comfortable working in codebases that have history.
          I focus on making them more structured, more predictable, and easier
          to extend.
        </p>
        <p className="text-lg">
          I work primarily in React and TypeScript. I&apos;ve built large
          frontends, rewritten legacy applications, and created standalone
          systems that connect cleanly to backend services. I pay attention to
          state management, API boundaries, and how components are organied so
          that the application can grow without becoming difficult to maintain.
        </p>
        <p className="text-lg">
          I&apos;ve also built internal tools and dashboard that interact with
          infrastructure systems, databases, and cloud services. These types of
          applications usually involve data-heavy interfaces, operational
          workflows, andn real constraint around performance and deployment.
        </p>
        <p className="text-lg">
          Outside of the browser, I&apos;ve written backend utilities and services
          in Go and Node. I&apos;ve built small servers, CLI tools, and automation scripts.
          Earlier in my career I worked in system administration, which means I&apos;me used 
          to thinking about how software behaves in production, during deployment, failure handling,
          and long-term maintenance.
        </p>
      </div>
    </div>
  );
}