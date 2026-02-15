export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="text-2xl font-semibold leading-8">UX Consulting</h1>
        <p className="text-lg">
          I help teams improve the usability and structure of their existing
          applications.
        </p>
        <p className="text-lg">
          I review the product as it exists today. I look at real workflows,
          real user constraints, and the actual implementation. I identify areas
          where the interface creates friction — either for users or for
          developers maintaining it.
        </p>
        <p className="text-lg">
          Sometimes that results in layout adjustments. Sometimes it requires
          rethinking how state is presented. In many cases, it’s about
          simplifying decision points and making the system’s behavior more
          obvious.
        </p>
        <p className="text-lg">
          Because I also write production code, my UX work is grounded in
          implementation reality. I don’t produce abstract design systems that
          ignore engineering constraints. I focus on changes that can be shipped
          and maintained.
        </p>
        <p className="text-lg">
          Typical consulting engagements include reviewing existing screens,
          refining layouts, clarifying data presentation, improving
          information hierarchy, and aligning interface structure with backend
          capabilities.
        </p>
      </div>
    </div>
  );
}