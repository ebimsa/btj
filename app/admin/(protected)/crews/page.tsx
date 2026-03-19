import { createCrew, deleteCrew, updateCrew } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import SaveSuccessAlert from "@/components/SaveSuccessAlert";
import CancelFormButton from "@/components/CancelFormButton";

export default async function CrewsAdminPage() {
  const crews = await prisma.crew.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <section>
      <SaveSuccessAlert />
      <h1 className="text-2xl font-black text-slate-900">Kelola Kru</h1>
      <p className="mt-2 text-sm text-slate-600">Kelola tim kru pengemudi dan staf bengkel.</p>

      <details className="hide-summary-when-open mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="hide-when-open cursor-pointer list-none rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-600">
          + Tambah Kru Baru
        </summary>
        <form action={createCrew} className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <input name="name" required placeholder="Nama lengkap" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <input name="role" required placeholder="Peran (Sopir, Kondektur, dll)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <div className="lg:col-span-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 px-5 py-6">
            <ImageUploadPreview name="photoFile" label="📸 Upload Foto Kru" required hint="Upload 1 foto kru" />
          </div>
          <div className="lg:col-span-2 flex flex-wrap justify-end gap-3">
            <SubmitButton className="h-11 min-w-32 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all">
              ✓ Simpan Kru
            </SubmitButton>
            <CancelFormButton />
          </div>
        </form>
      </details>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crews.map((crew: (typeof crews)[number]) => (
          <div key={crew.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 border-b border-slate-200 shrink-0">
              <img src={crew.photoUrl || ""} alt={crew.name} className="h-full w-full object-cover" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{crew.name}</h3>
                  <p className="text-sm font-medium text-orange-600">{crew.role}</p>
                </div>
                <form action={deleteCrew}>
                  <input type="hidden" name="id" value={crew.id} />
                  <button type="submit" className="rounded-lg bg-red-100 hover:bg-red-200 px-3 py-2 text-xs font-bold text-red-700 transition-all">
                    Hapus
                  </button>
                </form>
              </div>

            <details className="hide-summary-when-open mt-auto group">
              <summary className="hide-when-open cursor-pointer text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center hover:bg-slate-100 transition-colors list-none">
                Edit Data Kru
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200">
              <form action={updateCrew} className="grid grid-cols-1 gap-4">
                <input type="hidden" name="id" value={crew.id} />
                <input name="name" defaultValue={crew.name} required className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none w-full" />
                <input name="role" defaultValue={crew.role} required className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none w-full" />
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 w-full">
                  <ImageUploadPreview name="photoFile" label="📸 Update Foto Kru" hint="Opsional, jika diisi akan mengganti foto lama" />
                  <p className="text-xs text-slate-600 mb-2 font-medium">📷 Foto saat ini:</p>
                  <div className="w-16 h-16 rounded-lg border border-slate-300 mb-3 overflow-hidden">
                    <img src={crew.photoUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-3">
                  <SubmitButton className="h-11 min-w-32 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all">
                    💾 Simpan
                  </SubmitButton>
                  <CancelFormButton />
                </div>
              </form>
              </div>
            </details>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
