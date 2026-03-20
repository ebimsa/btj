export default function AdminProtectedLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-orange-100 bg-white/90 p-8 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

        <p className="mt-5 text-sm font-semibold tracking-wide text-slate-700">
          Memuat halaman admin...
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.25s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-600" />
        </div>
      </div>
    </div>
  );
}
