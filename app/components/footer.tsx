export default function Footer() {
  return (
    <div className="flex flex-col gap-2 mt-6 w-full">
      <h2 className="text-2xl font-semibold leading-8">Contact</h2>
      <p>You can reach me via e-mail or LinkedIn, feel free to message anytime!</p>
      <p>
        Email:{" "}
        <a href="mailto:geoff@pagefoundry.dev">geoff@pagefoundry.dev</a>
      </p>
      <p>
        LinkedIn:{" "}
        <a href="https://www.linkedin.com/in/geoff-storbeck-81a25035/">
          Geoff Storbeck
        </a>
      </p>
    </div>
  )
}