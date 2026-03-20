'use client';

import Image from 'next/image';

interface LandingNavbarProps {
  whatsappHref: string;
}

const navItems = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#unit', label: 'Unit' },
  { href: '#kru', label: 'Kru' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#kontak', label: 'Kontak' },
];

export default function LandingNavbar({ whatsappHref }: LandingNavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <a href="#beranda" className="shrink-0">
          <Image
            src="/btj.png"
            alt="Logo Bengal Trans Jaya"
            width={170}
            height={38}
            priority
            className="h-6 w-auto sm:h-9"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-orange-500"
              href={item.href}
            >
              {item.label}
            </a>
          ))}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white"
            aria-label="Chat WhatsApp"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </a>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white md:hidden"
          aria-label="Chat WhatsApp"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
        </a>
      </div>
    </nav>
  );
}
