export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold leading-8">
          Product & Frontend Engineering
        </h1>
        <p className="text-lg">
          I help product teams ship functional, usable, and well-designed
          software on budget and on time.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold leading-8">What I Do</h2>
        <ul className="text-lg list-disc">
          <li>Turn ambiguous product ideas into a shippable UI</li>
          <li>Modernize legacy systems without spending months on a rewrite</li>
          <li>Design interfaces that reduce cognitive load</li>
          <li>Integrate AI features safely into existing products</li>
          <li>Establish frontend architectures that scale</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold leading-8">Who I Work With</h2>
        <ul className="text-lg list-disc">
          <li>Small teams (3-15 engineers)</li>
          <li>Startups post-MVP entering scale</li>
          <li>Founders who need senior execution</li>
          <li>Companies with frontend debt slowing delivery</li>
        </ul>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold leading-8">Selected Work</h2>
        {/*  Chariot  */}
        <div className="pl-2 md:pl-8 border-l-3 flex flex-col gap-2">
          <div>
            <h3 className="text-xl font-semibold leading-8">
              Chariot – Offensive Security SaaS Platform
            </h3>
            <h4 className="text-lg font-semibold leading-8">
              Staff Software Engineer, Frontend Lead
            </h4>
            <p>
              <i>
                Praetorian’s offensive security platform used by enterprise
                security teams.
              </i>
              <br />I led the frontend rewrite of the platform, transitioning
              from slow monthly releases to same-day feature delivery.
            </p>
          </div>
          <h4 className="text-lg font-semibold leading-8">Scope & Impact</h4>
          <ul className="list-disc ml-6">
            <li>
              Rebuilt the frontend architecture using React, TypeScript, and
              Tailwind
            </li>
            <li>
              Established scalable component patterns and development workflows
            </li>
            <li>Reduced technical debt and improved developer velocity</li>
            <li>
              Improved deployment cadence from monthly releases to same-day
              shipping
            </li>
            <li>Contributed to cloud deployment workflows (AWS)</li>
          </ul>
          <p>
            The result was a faster-moving product organization with clearer UI
            patterns and stronger frontend foundations.
          </p>
        </div>

        {/* Cassandra as a Service */}
        <div className="pr-8 border-r-3 flex flex-col gap-2">
          <div>
            <h3 className="text-xl font-semibold leading-8">
              Casssandra as a Service – JPMorgan Chase
            </h3>
            <h4 className="text-lg font-semibold leading-8">
              Lead UI/UX Developer
            </h4>
            <p>
              <i>
                Internal platform allowing engineers to self-provision and
                manage Cassandra clusters.
              </i>
              <br />I redesigned and rebuilt the UI from an embedded Angular 1.x
              application into a standalone React/Redux system.
            </p>
          </div>
          <h4 className="text-lg font-semibold leading-8">Scope & Impact</h4>
          <ul className="list-disc ml-6">
            <li>
              Rewrote legacy Angular 1.x UI into modern React architecture
            </li>
            <li>
              Designed the entire user workflow around actual operator needs
            </li>
            <li>
              Built a web-based cluster management tool similar to SQL Server
              Management Studio
            </li>
            <li>
              Improved performance, maintainability, and onboarding for new
              developers
            </li>
          </ul>
          <p>
            This project required balancing enterprise constraints with
            developer usability at firm-wide scale.
          </p>
        </div>

        {/* Account Lifecycle Management */}
        <div className="pl-2 md:pl-8 border-l-3 flex flex-col gap-2">
          <div>
            <h3 className="text-xl font-semibold leading-8">
              Account Lifecycle Management – JPMorgan Chase
            </h3>
            <h4 className="text-lg font-semibold leading-8">
              Lead UI/UX Developer
            </h4>
            <p>
              <i>
                Internal compliance and remediation platform used firm-wide.
              </i>
              <br />I built the initial MVP that went to production and later
              led expansion as adoption scaled.
            </p>
          </div>
          <h4 className="text-lg font-semibold leading-8">Scope & Impact</h4>
          <ul className="list-disc ml-6">
            <li>Designed and implemented the foundational UI framework</li>
            <li>Conducted design studios with multiple lines of business</li>
            <li>
              Onboarded additional developers and standardized frontend patterns
            </li>
            <li>
              Maintained and supported multiple production applications
              simultaneously
            </li>
          </ul>
          <p>
            This work required strong stakeholder management and cross-team
            coordination.
          </p>
        </div>

        {/* Infrastructure & Systems Engineering Background */}
        <div className="pr-8 border-r-3 flex flex-col gap-2">
          <div>
            <h3 className="text-xl font-semibold leading-8">
              Infrastructure & Systems Engineering Background
            </h3>
            <h4 className="text-lg font-semibold leading-8">
              Systems Administrator → Application Developer
            </h4>
            <p>
              Before focusing exclusively on frontend, I worked in
              infrastructure and systems engineering roles involving:
            </p>
          </div>
          <ul className="list-disc ml-6">
            <li>
              Cross-datacenter migrations (300+ server migrations with zero
              downtime)
            </li>
            <li>Designing a LiveCD-based server duplication system</li>
            <li>
              Implementing IDS systems and vulnerability mitigation workflows
            </li>
            <li>Writing custom scaling algorithms for partition management</li>
          </ul>
          <p>
            This foundation influences how I design software today: with
            operational awareness and long-term maintainability in mind.
          </p>
        </div>

        {/* Infrastructure & Systems Engineering Background */}
        <div className="pl-2 md:pl-8 border-l-3 flex flex-col gap-2">
          <div>
            <h3 className="text-xl font-semibold leading-8">
              Freelance & Embedded Consulting – PageFoundry LLC
            </h3>
            <p>
              I now partner with startups and small teams as an embedded senior
              frontend engineer.
            </p>
          </div>
          <p>Typical engagements include:</p>
          <ul className="list-disc ml-6">
            <li>Greenfield UI architecture</li>
            <li>Legacy refactors without rewrites</li>
            <li>Frontend performance improvements</li>
            <li>AI feature integration</li>
            <li>Developer workflow optimization</li>
          </ul>
          <p>I embed directly with teams and ship production code.</p>
        </div>
      </div>
    </div>
  );
}
