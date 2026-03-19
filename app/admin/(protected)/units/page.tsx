import { createUnit, deleteUnit, updateUnit } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import SaveSuccessAlert from "@/components/SaveSuccessAlert";
import CancelFormButton from "@/components/CancelFormButton";
import { FACILITY_OPTIONS, toFacilityValue } from "@/lib/facility-options";

export default async function UnitsAdminPage() {
  const units = await prisma.unit.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      facilities: { orderBy: { sortOrder: "asc" } },
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <section>
      <SaveSuccessAlert />
      <h1 className="text-2xl font-black text-slate-900">Kelola Unit</h1>
      <p className="mt-2 text-sm text-slate-600">Kelola semua unit transportasi. Fasilitas dipilih via checklist icon + nama.</p>

      <details className="hide-summary-when-open mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="hide-when-open cursor-pointer list-none rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-600">
          + Tambah Unit Baru
        </summary>
        <form action={createUnit} className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <input name="name" required placeholder="Nama unit (contoh: Bus Medium 50 Seat)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <input name="capacity" required placeholder="Kapasitas kursi (contoh: 38, 50, 60)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <textarea name="description" required placeholder="Deskripsi unit" className="rounded-xl border border-slate-300 px-4 py-3 text-sm lg:col-span-2 focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" rows={3} />
          <div className="lg:col-span-2 rounded-2xl border border-slate-300 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-900">Pilih Fasilitas / Spesifikasi</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {FACILITY_OPTIONS.map((option) => (
                <label key={option.icon} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <input type="checkbox" name="facilityValues" value={toFacilityValue(option)} className="h-4 w-4" />
                  <span className="material-symbols-outlined text-base text-orange-600">{option.icon}</span>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 px-5 py-6">
            <ImageUploadPreview name="photoFiles" label="📸 Upload Foto Unit" multiple required hint="Bisa pilih banyak foto sekaligus" />
          </div>
          <div className="lg:col-span-2 flex flex-wrap justify-end gap-3">
            <SubmitButton className="h-11 min-w-32 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all">
              ✓ Simpan Unit
            </SubmitButton>
            <CancelFormButton className="h-11 min-w-32 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50" />
          </div>
        </form>
      </details>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit: (typeof units)[number]) => (
          <div key={unit.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 border-b border-slate-200 shrink-0">
              {unit.photos[0] ? (
                <img src={unit.photos[0].imageUrl || ""} alt={unit.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex bg-slate-200 h-full items-center justify-center text-slate-400">Belum ada foto</div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{unit.name}</h3>
                  <p className="text-sm font-medium text-orange-600">Kapasitas: {unit.capacity}</p>
                </div>
                <form action={deleteUnit}>
                  <input type="hidden" name="id" value={unit.id} />
                  <button type="submit" className="rounded-lg bg-red-100 hover:bg-red-200 px-3 py-2 text-xs font-bold text-red-700 transition-all">
                    Hapus
                  </button>
                </form>
              </div>

            <details className="hide-summary-when-open mt-auto group">
              <summary className="hide-when-open cursor-pointer text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center hover:bg-slate-100 transition-colors list-none">
                Edit Data Unit
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200">
              <form action={updateUnit} className="grid grid-cols-1 gap-3">
                <input type="hidden" name="id" value={unit.id} />
                <input name="name" defaultValue={unit.name} required className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none w-full" />
                <input name="capacity" defaultValue={unit.capacity} required className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none w-full" />
                <textarea name="description" defaultValue={unit.description} required className="rounded-xl border border-slate-300 px-4 py-3 text-sm flex-1 focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none w-full" rows={3} />
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <p className="mb-3 text-sm font-bold text-slate-900">Pilih Fasilitas / Spesifikasi</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {FACILITY_OPTIONS.map((option) => {
                      const facilityValue = toFacilityValue(option);
                      const selected = unit.facilities.some(
                        (facility: (typeof unit.facilities)[number]) => `${facility.icon} | ${facility.label}` === facilityValue
                      );

                      return (
                        <label key={`${unit.id}-${option.icon}`} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            name="facilityValues"
                            value={facilityValue}
                            defaultChecked={selected}
                            className="h-4 w-4"
                          />
                          <span className="material-symbols-outlined text-base text-orange-600">{option.icon}</span>
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 w-full">
                  <ImageUploadPreview name="photoFiles" label="📸 Update Foto Unit" multiple hint="Upload foto tambahan jika diperlukan" />
                  <p className="text-xs text-slate-600 mb-2 font-medium">📷 Foto saat ini:</p>
                  <div className="mb-3 flex gap-2 flex-wrap">
                    {unit.photos.slice(0, 3).map((photo: (typeof unit.photos)[number]) => (
                      <label key={photo.id} className="relative w-16 h-16 rounded-lg border border-slate-300 overflow-hidden cursor-pointer group">
                        <img src={photo.imageUrl} alt="preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                        <input type="checkbox" name="removePhotoIds" value={photo.id} className="absolute top-1 right-1 h-4 w-4" />
                      </label>
                    ))}
                    {unit.photos.length > 3 && (
                      <div className="w-16 h-16 rounded-lg border border-slate-300 flex items-center justify-center bg-slate-100">
                        <span className="text-xs font-bold text-slate-600">+{unit.photos.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">Centang foto untuk dihapus, lalu upload foto baru jika perlu.</p>
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
