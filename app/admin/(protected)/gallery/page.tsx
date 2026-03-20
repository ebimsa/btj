import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import SaveSuccessAlert from "@/components/SaveSuccessAlert";
import CancelFormButton from "@/components/CancelFormButton";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";

export default async function GalleryAdminPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] });
  const momentItems = items.filter((item: (typeof items)[number]) => item.type === "MOMENT");
  const testimonialItems = items.filter((item: (typeof items)[number]) => item.type === "TESTIMONIAL");

  return (
    <section>
      <SaveSuccessAlert />
      <h1 className="text-2xl font-black text-slate-900">Kelola Galeri & Testimoni</h1>
      <p className="mt-2 text-sm text-slate-600">Kelola foto momen dan testimoni pelanggan Bengal Trans Jaya.</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">Kolom bertanda * wajib diisi. Kolom tanpa tanda bisa dikosongkan.</p>

      <details className="hide-summary-when-open mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="hide-when-open cursor-pointer list-none rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-600">
          + Tambah Item Baru
        </summary>
        <form action={createGalleryItem} className="mt-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 px-5 py-6">
            <ImageUploadPreview name="imageFile" label="📸 Upload Foto" required hint="Upload 1 foto untuk galeri" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">Jenis *</label>
            <select name="type" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none">
              <option value="MOMENT">📷 Galeri Momen</option>
              <option value="TESTIMONIAL">⭐ Testimoni</option>
            </select>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <SubmitButton className="h-11 min-w-32 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all">
              ✓ Simpan Item
            </SubmitButton>
            <CancelFormButton />
          </div>
        </form>
      </details>

      <div className="mt-8">
        <h2 className="text-lg font-black text-slate-900">Galeri Momen</h2>
        <p className="mt-1 text-xs text-slate-500">Foto momen kegiatan, ditampilkan di bagian atas.</p>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {momentItems.map((item: (typeof momentItems)[number]) => (
          <div key={item.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 border-b border-slate-200 shrink-0">
              <img src={item.imageUrl || ""} alt={item.type} className="h-full w-full object-cover" />
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.type === "MOMENT" ? "Galeri Momen" : "Testimoni"}</h3>
                  <p className="text-sm font-medium text-orange-600">Urutan: {item.sortOrder}</p>
                </div>
                <form action={deleteGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteSubmitButton className="rounded-lg bg-red-100 hover:bg-red-200 px-3 py-2 text-xs font-bold text-red-700">
                    Hapus
                  </DeleteSubmitButton>
                </form>
              </div>

            <details className="hide-summary-when-open mt-auto group">
              <summary className="hide-when-open cursor-pointer text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center hover:bg-slate-100 transition-colors list-none">
                Edit Item
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200">
              <form action={updateGalleryItem} className="grid grid-cols-1 gap-4">
                <input type="hidden" name="id" value={item.id} />
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 w-full">
                  <ImageUploadPreview name="imageFile" label="📸 Update Foto" hint="Opsional, jika diisi akan mengganti foto lama" />
                  <p className="text-xs text-slate-600 mb-2 font-medium">📷 Foto saat ini:</p>
                  <div className="w-16 h-16 rounded-lg border border-slate-300 mb-3 overflow-hidden">
                    <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-900">Jenis</label>
                  <select name="type" defaultValue={item.type} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none">
                    <option value="MOMENT">📷 Galeri Momen</option>
                    <option value="TESTIMONIAL">⭐ Testimoni</option>
                  </select>
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

      <div className="mt-10">
        <h2 className="text-lg font-black text-slate-900">Galeri Testimoni</h2>
        <p className="mt-1 text-xs text-slate-500">Foto testimoni pelanggan, ditampilkan di bagian bawah.</p>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialItems.map((item: (typeof testimonialItems)[number]) => (
          <div key={item.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 border-b border-slate-200 shrink-0">
              <img src={item.imageUrl || ""} alt={item.type} className="h-full w-full object-cover" />
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.type === "MOMENT" ? "Galeri Momen" : "Testimoni"}</h3>
                  <p className="text-sm font-medium text-orange-600">Urutan: {item.sortOrder}</p>
                </div>
                <form action={deleteGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteSubmitButton className="rounded-lg bg-red-100 hover:bg-red-200 px-3 py-2 text-xs font-bold text-red-700">
                    Hapus
                  </DeleteSubmitButton>
                </form>
              </div>

            <details className="hide-summary-when-open mt-auto group">
              <summary className="hide-when-open cursor-pointer text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center hover:bg-slate-100 transition-colors list-none">
                Edit Item
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200">
              <form action={updateGalleryItem} className="grid grid-cols-1 gap-4">
                <input type="hidden" name="id" value={item.id} />
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 w-full">
                  <ImageUploadPreview name="imageFile" label="📸 Update Foto" hint="Opsional, jika diisi akan mengganti foto lama" />
                  <p className="text-xs text-slate-600 mb-2 font-medium">📷 Foto saat ini:</p>
                  <div className="w-16 h-16 rounded-lg border border-slate-300 mb-3 overflow-hidden">
                    <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-900">Jenis</label>
                  <select name="type" defaultValue={item.type} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-slate-300 focus:border-transparent outline-none">
                    <option value="MOMENT">📷 Galeri Momen</option>
                    <option value="TESTIMONIAL">⭐ Testimoni</option>
                  </select>
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
