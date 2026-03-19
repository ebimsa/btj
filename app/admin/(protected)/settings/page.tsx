import { createHeroSlide, deleteHeroSlide, updateSiteConfig } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import HeroThumbnail from "@/components/HeroThumbnail";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import SaveSuccessAlert from "@/components/SaveSuccessAlert";
import CancelFormButton from "@/components/CancelFormButton";

export default async function SettingsAdminPage() {
  const [config, slides] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <section>
      <SaveSuccessAlert />
      <h1 className="text-2xl font-black text-slate-900">Pengaturan Website</h1>
      <p className="mt-2 text-sm text-slate-600">Kelola konten utama dan konfigurasi website.</p>

      <details className="hide-summary-when-open mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="hide-when-open cursor-pointer list-none rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800">
          ⚙️ Edit Konten Hero & Kontak
        </summary>
        <form action={updateSiteConfig} className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <input name="heroTitle" defaultValue={config?.heroTitle || ""} required placeholder="Judul utama hero" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <input name="heroSubtitle" defaultValue={config?.heroSubtitle || ""} required placeholder="Subtitle (label kecil)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <textarea name="heroDescription" defaultValue={config?.heroDescription || ""} required placeholder="Deskripsi lengkap hero" className="rounded-xl border border-slate-300 px-4 py-3 text-sm lg:col-span-2 focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" rows={3} />
          <input name="whatsappNumber" defaultValue={config?.whatsappNumber || ""} required placeholder="Nomor WA (628xxxxx atau 08xxxxx atau +628xxxxx)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <input name="whatsappLabel" defaultValue={config?.whatsappLabel || ""} required placeholder="Teks tombol WA (contoh: Chat WhatsApp)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <input name="locationLabel" defaultValue={config?.locationLabel || ""} required placeholder="nama lokasi (contoh: Lampung)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none" />
          <div className="lg:col-span-2 flex flex-wrap justify-end gap-3">
            <SubmitButton className="h-11 min-w-32 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all">
              💾 Simpan Pengaturan
            </SubmitButton>
            <CancelFormButton />
          </div>
        </form>
      </details>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4">📸 Foto Hero di Halaman Utama</h2>

        <details className="hide-summary-when-open rounded-xl border border-slate-200 p-4">
          <summary className="hide-when-open cursor-pointer list-none rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-600">
            + Tambah Foto Hero
          </summary>
          <form action={createHeroSlide} className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-3 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 px-5 py-6">
              <ImageUploadPreview name="imageFile" label="📸 Upload Foto Hero" required hint="Upload 1 foto hero" />
            </div>
            <div className="lg:col-span-3 flex flex-wrap justify-end gap-3">
              <SubmitButton className="h-11 min-w-32 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all">
                ✓ Tambah Foto Hero
              </SubmitButton>
              <CancelFormButton />
            </div>
          </form>
        </details>

        <div className="mt-4 space-y-3">
          {slides.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Belum ada foto hero. Silakan tambahkan foto di atas.</p>
          ) : (
            slides.map((slide: (typeof slides)[number]) => (
              <div key={slide.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-xl border border-slate-200 px-4 py-4 hover:bg-slate-50 transition-colors">
                {/* Thumbnail */}
                <HeroThumbnail url={slide.imageUrl} alt="hero preview" />

                {/* URL & Metadata */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 mb-1">URL:</p>
                  <p className="break-all text-xs text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded mb-2">{slide.imageUrl}</p>
                  <p className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">Urutan: {slide.sortOrder}</p>
                </div>

                {/* Delete Button */}
                <form action={deleteHeroSlide} className="flex-shrink-0">
                  <input type="hidden" name="id" value={slide.id} />
                  <button type="submit" className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all">
                    🗑️ Hapus
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
