import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [unitCount, crewCount, galleryCount, testimonialCount, heroCount] = await Promise.all([
    prisma.unit.count(),
    prisma.crew.count(),
    prisma.galleryItem.count({ where: { type: "MOMENT" } }),
    prisma.galleryItem.count({ where: { type: "TESTIMONIAL" } }),
    prisma.heroSlide.count(),
  ]);

  const cards = [
    { label: "Unit", value: unitCount, href: "/admin/units" },
    { label: "Kru", value: crewCount, href: "/admin/crews" },
    { label: "Galeri Momen", value: galleryCount, href: "/admin/gallery" },
    { label: "Testimoni", value: testimonialCount, href: "/admin/gallery" },
    { label: "Hero Slides", value: heroCount, href: "/admin/settings" },
  ];

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-900">📊 Dashboard Admin</h1>
      <p className="mt-2 text-sm text-slate-600">Kelola konten website Bengal Trans Jaya dari satu panel pusat.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:ring-2 hover:ring-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-orange-600 transition-colors">{card.label}</p>
            <p className="mt-3 text-4xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6 text-sm text-orange-900">
        <p className="font-semibold mb-2">💡 Tips Penggunaan:</p>
        <ul className="space-y-1 text-xs">
          <li>• Ubah nomor WhatsApp dan foto hero di menu <span className="font-semibold">Pengaturan</span></li>
          <li>• Foto hero akan ditampilkan di halaman utama website</li>
          <li>• Semua perubahan akan langsung terlihat di website publik</li>
        </ul>
      </div>
    </section>
  );
}
