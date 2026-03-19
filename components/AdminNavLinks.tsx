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
              'shrink-0 whitespace-nowrap rounded-xl px-3 py-2 transition-all',
              isActive
                ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-300'
                : 'text-slate-700 hover:bg-slate-100 hover:text-orange-600',
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
