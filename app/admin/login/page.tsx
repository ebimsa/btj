import Link from "next/link";
import { loginAction } from "@/app/admin/login/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-black text-slate-900">Admin BTJ</h1>
        <p className="mt-2 text-sm text-slate-600">Login untuk mengatur konten website.</p>

        {params.error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {params.error}
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-orange-300 transition focus:ring"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-orange-300 transition focus:ring"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600">
            Masuk
          </SubmitButton>
        </form>

        <Link href="/" className="mt-6 inline-block text-xs font-semibold text-slate-500 hover:text-slate-700">
          Kembali ke landing page
        </Link>
      </div>
    </main>
  );
}
