export type InsightSection = {
  heading: string;
  paragraphs: string[];
};

export type InsightPost = {
  slug: string;
  originalSlug: string;
  title: string;
  description: string;
  publishedDate: string;
  intro: string;
  sections: InsightSection[];
  takeaways: string[];
};

export const insightPosts: InsightPost[] = [
  {
    slug: "why-saas-products-feel-confusing-even-with-correct-backends",
    originalSlug: "why-your-design-sucks",
    title: "Why SaaS Products Feel Confusing Even When the Backend Is Correct",
    description:
      "How data-first sequencing creates UX friction, and what engineering leaders can do to ship workflows users actually understand.",
    publishedDate: "2026-01-27",
    intro:
      "This piece is for product and engineering leaders who keep hearing that the UI needs another redesign while the backend is already considered done. In practice, many confusing interfaces are architecture-sequencing problems, not visual design failures.",
    sections: [
      {
        heading: "Where Confusion Starts",
        paragraphs: [
          "Teams often finalize schemas and APIs before validating user workflows. The result is an interface that mirrors internal models instead of user tasks.",
          "That sequence creates expensive frontend workarounds and repeated feature rework late in delivery.",
        ],
      },
      {
        heading: "What To Change",
        paragraphs: [
          "Prototype the workflow before locking API shapes. Validate top user tasks with lightweight usability sessions early.",
          "Turn UX findings into explicit backend requirements so frontend does not become a translation layer for system complexity.",
        ],
      },
    ],
    takeaways: [
      "A technically correct backend can still produce a confusing product.",
      "Workflow-first planning reduces rework and delivery risk.",
      "Frontend quality depends on architecture decisions made upstream.",
    ],
  },
  {
    slug: "reducing-frontend-latency-by-collapsing-chatty-request-chains",
    originalSlug: "collapse-6-fetches-into-1",
    title: "How We Reduced Frontend Latency by Collapsing Chatty Request Chains",
    description:
      "A practical pattern for replacing multi-step frontend fetch chains with consolidated request flows that reduce wait time and UI jitter.",
    publishedDate: "2025-10-15",
    intro:
      "This post is aimed at teams whose dashboards feel slow even when each endpoint is reasonably fast. The issue is often request choreography, not one bad query.",
    sections: [
      {
        heading: "The Latency Trap",
        paragraphs: [
          "Many products build pages through dependent request chains. Each request adds network overhead and amplifies user-visible delay.",
          "As complexity grows, these chains increase fragility and make loading states hard to reason about.",
        ],
      },
      {
        heading: "The Consolidation Pattern",
        paragraphs: [
          "Group related data needs into a single orchestrated request boundary where possible, then stream or partition updates intentionally.",
          "This reduces round trips, simplifies frontend state handling, and makes performance behavior predictable under load.",
        ],
      },
    ],
    takeaways: [
      "Request topology matters as much as endpoint speed.",
      "Consolidating fetch chains improves both latency and code maintainability.",
      "A cleaner data boundary creates clearer UI state transitions.",
    ],
  },
  {
    slug: "automating-usability-checks-in-ci-with-playwright",
    originalSlug: "playwright-automated-usability-testing",
    title: "Automating Usability Checks in CI with Playwright",
    description:
      "How to add repeatable UX guardrails to CI so regressions in navigation, focus, and critical flows are caught before release.",
    publishedDate: "2025-10-17",
    intro:
      "For teams shipping quickly, usability defects can slip into production even when unit and integration tests pass. This approach treats key user flows as testable product contracts.",
    sections: [
      {
        heading: "What To Automate",
        paragraphs: [
          "Prioritize high-impact journeys: login, search, core task completion, and error recovery. Focus on behaviors users must complete reliably.",
          "Include accessibility-adjacent checks such as keyboard pathing and visible focus for critical interactions.",
        ],
      },
      {
        heading: "How To Roll It Out",
        paragraphs: [
          "Start with a small suite that runs in CI on every PR and blocks merges on critical regressions.",
          "Keep tests close to product language so PM, design, and engineering can review failures with shared context.",
        ],
      },
    ],
    takeaways: [
      "Usability checks can be automated without replacing qualitative research.",
      "Critical flow tests reduce release anxiety and regression cost.",
      "CI feedback is strongest when test names match product behavior.",
    ],
  },
  {
    slug: "derisking-frontend-modernization-by-removing-dead-code-first",
    originalSlug: "remove-dead-code-with-knip",
    title: "De-Risking Frontend Modernization by Removing Dead Code First",
    description:
      "Why dead-code removal should be the first phase of legacy modernization, with a practical path to shrink risk before major upgrades.",
    publishedDate: "2025-10-15",
    intro:
      "Before framework upgrades, design overhauls, or architecture resets, this method reduces blast radius by removing unused files, exports, and dependencies first.",
    sections: [
      {
        heading: "Why This Sequence Works",
        paragraphs: [
          "Legacy codebases hide outdated modules and unclear ownership. Upgrading on top of that noise inflates migration effort and defects.",
          "A dead-code pass simplifies dependency graphs and clarifies what actually powers production behavior.",
        ],
      },
      {
        heading: "Execution Pattern",
        paragraphs: [
          "Run static analysis, remove low-risk dead paths incrementally, and verify with fast regression checks after each batch.",
          "Once code volume is lower, major upgrades become more predictable and easier to estimate.",
        ],
      },
    ],
    takeaways: [
      "Code deletion is one of the safest modernization accelerators.",
      "Smaller dependency surfaces reduce upgrade risk.",
      "Teams get clearer ownership when unused paths are removed.",
    ],
  },
  {
    slug: "from-generic-ui-to-intentional-design-reference-driven-workflow",
    originalSlug: "design-prompts-references",
    title: "From Generic UI to Intentional Design: A Reference-Driven Workflow",
    description:
      "A practical framework for getting specific, high-quality interface output by anchoring teams on concrete references and constraints.",
    publishedDate: "2025-10-16",
    intro:
      "When product teams ask for a beautiful UI without shared references, output becomes inconsistent and subjective. This workflow creates alignment before implementation starts.",
    sections: [
      {
        heading: "Define the Design Contract",
        paragraphs: [
          "Collect explicit references, interaction expectations, and hierarchy rules before requesting implementation.",
          "Replace vague visual requests with measurable constraints: typography, layout rhythm, density, motion intent, and brand voice.",
        ],
      },
      {
        heading: "Operationalize in Delivery",
        paragraphs: [
          "Translate references into reusable components and tokens so design intent survives engineering handoff.",
          "Run quick review loops against the reference set to avoid drift toward generic UI patterns.",
        ],
      },
    ],
    takeaways: [
      "References reduce ambiguity and rework.",
      "Design constraints improve implementation speed.",
      "Intentional systems outperform generic visual polish.",
    ],
  },
  {
    slug: "frontend-quality-is-layered-work-not-surface-polish",
    originalSlug: "bodywork-and-interfaces",
    title: "Frontend Quality Is Layered Work, Not Surface Polish",
    description:
      "A practical view of frontend quality: reliable interfaces are built through layered refinement, not one-pass styling.",
    publishedDate: "2025-10-22",
    intro:
      "This post reframes frontend quality as a layered engineering practice. Strong interfaces emerge from repeated passes across flow, copy, states, behavior, and visual clarity.",
    sections: [
      {
        heading: "The Layered Model",
        paragraphs: [
          "Base components and layout are only the first pass. Real quality appears when teams refine edge states, interaction timing, and feedback loops.",
          "Shipping too early on surface polish produces interfaces that look acceptable but feel unreliable in real workflows.",
        ],
      },
      {
        heading: "Applying It to Product Teams",
        paragraphs: [
          "Plan quality passes explicitly: first function, then clarity, then confidence-building details.",
          "Treat these passes as part of engineering scope rather than optional cleanup.",
        ],
      },
    ],
    takeaways: [
      "Quality is cumulative and iterative.",
      "Edge states and interaction details are product-critical work.",
      "Layered refinement increases user trust and completion rates.",
    ],
  },
];

export function getInsightPostBySlug(slug: string): InsightPost | undefined {
  return insightPosts.find((post) => post.slug === slug);
}
