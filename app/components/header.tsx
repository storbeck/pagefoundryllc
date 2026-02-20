import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between gap-3 py-1">
      <div className="min-w-0 flex-1">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            className="block h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-16 md:w-16"
            src="/logo.png"
            alt="PageFoundry LLC"
            width={100}
            height={100}
            unoptimized
            priority
          />
          <h1 className="truncate text-xl font-semibold leading-none sm:text-2xl md:text-4xl">
            PageFoundry LLC
          </h1>
        </Link>
      </div>
      <div className="flex shrink-0 flex-row items-center gap-2 sm:gap-4">
        <Link href="mailto:geoff@pagefoundry.dev">
          <Image
            className="block dark:invert"
            src="/email.svg"
            alt="E-Mail"
            width={40}
            height={40}
            priority
          />
        </Link>
        <Link href="https://www.linkedin.com/in/geoff-storbeck-81a25035/">
          <Image
            className="block dark:invert-0"
            src="/linkedin.png"
            alt="LinkedIn"
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>
    </div>
  );
}
