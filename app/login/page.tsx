import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const errorParam = sp.error;

  const error =
    errorParam === "missing"
      ? "Email and password are required."
      : errorParam === "invalid"
        ? "Invalid email or password."
        : null;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>

        {error ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm">
            {error}
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="rounded-md border px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="rounded-md border px-3 py-2"
              required
            />
          </label>

          <button className="mt-2 rounded-md bg-black px-3 py-2 text-white">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
