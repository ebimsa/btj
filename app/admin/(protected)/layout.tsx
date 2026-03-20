import { logoutAdmin } from "@/app/admin/actions";
import AdminNavLinks from "@/components/AdminNavLinks";
import AdminScrollableNav from "@/components/AdminScrollableNav";
import LogoutSubmitButton from "@/components/LogoutSubmitButton";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">🚌 Portal Admin BTJ</p>
            <p className="text-sm font-medium text-slate-600">Login sebagai <span className="font-bold text-slate-900">{admin.username}</span></p>
          </div>

          <AdminScrollableNav>
              <AdminNavLinks />
              <form action={logoutAdmin}>
                <LogoutSubmitButton />
              </form>
          </AdminScrollableNav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
