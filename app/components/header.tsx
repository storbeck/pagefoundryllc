import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <div className="flex w-full flex-row items-center">
        <Link href="/" className="flex w-full flex-row items-center">
          <Image
            className="block dark:invert"
            src="/logo.png"
            alt="PageFoundry LLC"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-xl md:text-4xl font-semibold">PageFoundry LLC</h1>
        </Link>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Link href="mailto:geoff@pagefoundry.dev">
          <Image
            className="block dark:invert"
            src="/email.svg"
            alt="E-Mail"
            width={50}
            height={50}
            priority
          />
        </Link>
        <Link href="https://www.linkedin.com/in/geoff-storbeck-81a25035/">
          <Image
            className="block dark:invert"
            src="/linkedin.png"
            alt="LinkedIn"
            width={50}
            height={50}
            priority
          />
        </Link>
      </div>
    </div>
  );
}
