'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/units', label: '🚍 Unit' },
  { href: '/admin/crews', label: '👥 Kru' },
  { href: '/admin/gallery', label: '📸 Galeri' },
  { href: '/admin/settings', label: '⚙️ Pengaturan' },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((item) => {
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'shrink-0 whitespace-nowrap rounded-xl px-3 py-2 transition-all duration-200',
              isActive
                ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md ring-1 ring-orange-300/70'
                : 'text-slate-700 hover:bg-orange-50 hover:text-orange-700',
            ].join(' ')}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
