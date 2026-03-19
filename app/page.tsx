import Image from "next/image";
import { getPublicData } from "@/lib/public-data";
import HeroCarousel from "@/components/HeroCarousel";

export default async function Home() {
  const data = await getPublicData();
  const whatsappHref = `https://wa.me/${data.config.whatsappNumber}`;

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-extrabold italic tracking-tight text-slate-900 sm:text-2xl">
            Bengal Trans Jaya
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a className="text-sm font-bold text-orange-600" href="#beranda">Beranda</a>
            <a className="text-sm font-semibold text-slate-600 transition-colors hover:text-orange-500" href="#unit">Unit</a>
            <a className="text-sm font-semibold text-slate-600 transition-colors hover:text-orange-500" href="#kru">Kru</a>
            <a className="text-sm font-semibold text-slate-600 transition-colors hover:text-orange-500" href="#galeri">Galeri</a>
            <a className="text-sm font-semibold text-slate-600 transition-colors hover:text-orange-500" href="#kontak">Kontak</a>
            <a
              href="/admin/login"
              className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Admin
            </a>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white sm:block"
          >
            Konsultasi
          </a>
        </div>
      </nav>

      <HeroCarousel
        slides={data.heroSlides}
        heroTitle={data.config.heroTitle}
        heroSubtitle={data.config.heroSubtitle}
        locationLabel={data.config.locationLabel}
        heroDescription={data.config.heroDescription}
        whatsappLabel={data.config.whatsappLabel}
        whatsappNumber={data.config.whatsappNumber}
      />

      <main className="relative z-20 mx-auto w-full max-w-7xl px-6 py-12 md:py-20 lg:py-28">
        <section id="unit" className="mb-20 md:mb-32">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-black text-slate-900 sm:text-4xl">Unit Kami</h2>
              <p className="font-medium text-slate-600">Data unit dikelola dari portal admin.</p>
            </div>
            <div className="hidden h-1 w-32 bg-orange-500 md:block" />
          </div>

          <div className="space-y-8">
            {data.units.map((unit) => (
              <article key={unit.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
                  <div>
                    <div className="mb-3 flex flex-wrap items-baseline gap-3">
                      <h3 className="text-2xl font-bold text-slate-900">{unit.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-orange-600">
                        <span className="material-symbols-outlined text-lg">event_seat</span>
                        {unit.capacity}
                      </div>
                    </div>
                    <p className="mb-5 text-sm leading-relaxed text-slate-600">{unit.description}</p>

                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-700">Fasilitas</h4>
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {unit.facilities.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <span className="material-symbols-outlined text-[20px] text-orange-600">{item.icon}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-700">Galeri Unit (Geser)</h4>
                    <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2">
                      {unit.photos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="relative h-56 min-w-[85%] snap-start overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 sm:h-64 sm:min-w-[70%]"
                        >
                          <Image
                            src={photo.imageUrl}
                            alt={`${unit.name} gambar ${index + 1}`}
                            fill
                            sizes="(min-width: 1024px) 40vw, 85vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="kru" className="mb-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-black text-slate-900 sm:text-4xl">Kru Profesional Kami</h2>
              <p className="font-medium text-slate-600">Data kru dikelola dari portal admin.</p>
            </div>
            <div className="hidden h-1 w-32 bg-orange-500 md:block" />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:grid-cols-3 md:gap-10">
            {data.crews.map((crew) => (
              <div key={crew.id} className="group relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg sm:rounded-3xl sm:shadow-2xl">
                  <Image alt={crew.name} className="object-cover" fill src={crew.photoUrl} />
                </div>
                <div className="relative -mt-6 mx-2 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 sm:-mt-12 sm:mx-6 sm:rounded-3xl sm:p-5">
                  <div className="text-center">
                    <h3 className="text-[10px] font-black tracking-tight text-slate-900 sm:text-xl">{crew.name}</h3>
                    <p className="text-[8px] font-bold tracking-widest text-orange-600 uppercase sm:text-xs sm:tracking-[0.2em]">{crew.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="galeri" className="py-20">
          <div className="mb-12 flex items-center justify-between">
            <div className="max-w-xl">
              <h2 className="mb-2 text-3xl font-black text-slate-900 sm:text-4xl">Momen & Testimoni</h2>
              <p className="font-medium text-slate-600">Foto momen dan testimoni dikelola dari portal admin.</p>
            </div>
            <div className="hidden h-1 w-32 bg-orange-500 md:block" />
          </div>

          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:mb-16">
            {data.moments.map((item, idx) => (
              <div key={item.id} className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all hover:shadow-lg">
                <Image
                  src={item.imageUrl}
                  alt={`Galeri Bengal Trans Jaya ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.testimonials.map((item, idx) => (
              <div key={item.id} className="group relative aspect-video overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <Image
                  src={item.imageUrl}
                  alt={`Testimoni Bengal Trans Jaya ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="kontak" className="mt-auto border-t border-slate-800 bg-slate-900 px-6 py-12 text-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-6 text-lg font-bold">Bengal Trans Jaya</div>
            <p className="mb-6 max-w-xs text-sm text-slate-400">
              Mitra transportasi terpercaya di {data.config.locationLabel} dan sekitarnya.
              Melayani sewa bus pariwisata dan perjalanan antar kota.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-500">Alamat</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Marga Mulya Jalan 7 (Toko Enggal)</li>
              <li>Terbanggi Besar, Lampung Tengah</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-500">Kontak Cepat</h4>
            <p className="mb-4 text-xs text-slate-400">Hubungi admin untuk ketersediaan unit dan penawaran harga terbaik.</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
            >
              Chat WhatsApp
              <span className="material-symbols-outlined">chat</span>
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-400 md:flex-row">
          <p>© 2026 Bengal Trans Jaya ({data.config.locationLabel}). Seluruh hak cipta dilindungi.</p>
          <a href="/admin/login" className="rounded-lg bg-slate-800/50 px-3 py-2 font-medium text-slate-300 hover:text-orange-400">
            Admin Portal
          </a>
        </div>
      </footer>
    </>
  );
}
