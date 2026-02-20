import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product and Frontend Engineering Services",
  description:
    "PageFoundry helps SaaS teams modernize frontend architecture, clarify UX, and ship production-ready interfaces faster.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const problemPoints = [
    "Frontend teams are blocked by legacy code and unclear ownership.",
    "Product ideas stay vague and fail to become shippable UI fast enough.",
    "Growth gets constrained by fragile architecture and poor UX clarity.",
  ];

  const approachPoints = [
    "Ship an iterative target architecture instead of a long rewrite.",
    "Design and code from shared product language so PM/design/engineering stay aligned.",
    "Raise delivery speed with reusable component patterns and decision records.",
    "Integrate AI features with guardrails and maintainable frontend boundaries.",
  ];

  const caseStudies = [
    {
      company: "Chariot (Praetorian) - Offensive Security SaaS Platform",
      role: "Staff Software Engineer, Frontend Lead",
      challenge:
        "Release cycles were constrained by a legacy frontend and inconsistent patterns.",
      work: "Led a frontend architecture reset, standardized component patterns, and aligned release workflows with product delivery.",
      outcomes: [
        "Improved deployment cadence from monthly releases to same-day shipping.",
        "Reduced frontend technical debt and increased team delivery throughput.",
      ],
      stack: ["React", "TypeScript", "Tailwind", "AWS"],
    },
    {
      company: "Cassandra as a Service (JPMorgan Chase)",
      role: "Lead UI/UX Developer",
      challenge:
        "Engineers needed a usable self-service experience, but the existing Angular 1.x UI was embedded and hard to evolve.",
      work: "Redesigned the operator workflow and rebuilt the UI as a standalone React/Redux platform.",
      outcomes: [
        "Migrated from Angular 1.x to a maintainable modern frontend architecture.",
        "Improved onboarding and day-to-day usability for cluster operators.",
      ],
      stack: ["React", "Redux", "Platform UX", "Enterprise Systems"],
    },
    {
      company: "Account Lifecycle Management (JPMorgan Chase)",
      role: "Lead UI/UX Developer",
      challenge:
        "A new compliance platform required an MVP that could scale to multiple lines of business.",
      work: "Built the foundational UI framework, ran design studios, and onboarded additional developers into shared patterns.",
      outcomes: [
        "Delivered the initial MVP to production and supported expansion across multiple applications.",
        "Established frontend standards that improved cross-team consistency.",
      ],
      stack: ["Design Studios", "Stakeholder Alignment", "Frontend Standards"],
    },
    {
      company: "Infrastructure and Systems Engineering",
      role: "Systems Administrator to Application Developer",
      challenge:
        "Large-scale infrastructure work demanded reliability under high operational constraints.",
      work: "Delivered cross-datacenter migrations, security hardening workflows, and internal automation systems.",
      outcomes: [
        "Executed 300+ server migrations with zero downtime.",
        "Applied operational rigor to frontend architecture and reliability decisions.",
      ],
      stack: ["Reliability", "Security", "Operations", "Scalability"],
    },
  ];

  return (
    <div className="flex flex-col gap-14 pb-8">
      <section className="flex flex-col gap-4">
        <h1>I help SaaS teams ship better frontend products, faster.</h1>
        <p className="max-w-3xl">
          I work with SaaS teams that are shipping slower than they should
          because UI systems are hard to change, product direction is fuzzy, or
          architecture can no longer support growth. I especially enjoy
          greenfield products and turning bland frontends into interfaces that
          feel alive and clear.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          {problemPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <span className="section-kicker">Approach</span>
        <h2>Execution-first product engineering, not redesign theater.</h2>
        <p className="max-w-3xl">
          I partner directly with founders and product teams to define
          architecture, clarify UX decisions, and ship production interfaces
          quickly while preserving long-term maintainability.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          {approachPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-5">
        <span className="section-kicker">Proof</span>
        <h2>Selected case studies</h2>
        <p className="max-w-3xl">
          These projects span enterprise platforms, security SaaS, and
          large-scale internal systems where I led frontend architecture and
          delivery outcomes.
        </p>
        <div className="flex flex-col gap-6">
          {caseStudies.map((study) => (
            <article key={study.company} className="case-study">
              <header className="case-study-head">
                <h3>{study.company}</h3>
                <p className="case-study-role">{study.role}</p>
              </header>

              <div className="case-study-body">
                <div>
                  <h4 className="case-study-label">Challenge</h4>
                  <p>{study.challenge}</p>
                </div>
                <div>
                  <h4 className="case-study-label">What I Built</h4>
                  <p>{study.work}</p>
                </div>
                <div>
                  <h4 className="case-study-label">Outcomes</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {study.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
                <ul className="case-study-stack">
                  {study.stack.map((tech) => (
                    <li key={tech} className="tag-chip px-2 py-1">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 border-l-3 border-teal-700 pl-4">
        <span className="section-kicker">Engagement</span>
        <h2>How we can work together</h2>
        <p className="max-w-3xl">
          Typical engagements include architecture reset, legacy modernization,
          product UX clarification, and AI feature integration. I embed with
          your team, own delivery, and leave behind systems that your engineers
          can sustain.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Greenfield product builds from idea to production UI.</li>
          <li>Frontend revitalization for products that feel flat or dated.</li>
          <li>Small product teams (3-15 engineers) navigating growth.</li>
          <li>Post-MVP startups preparing for scale and reliability.</li>
          <li>Organizations with visible frontend debt and delivery friction.</li>
          <li>Founders who need senior-level execution, not just strategy.</li>
        </ul>
      </section>
    </div>
  );
}
