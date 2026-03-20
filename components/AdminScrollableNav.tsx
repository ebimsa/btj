'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface AdminScrollableNavProps {
  children: React.ReactNode;
}

export default function AdminScrollableNav({ children }: AdminScrollableNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(35);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

    const updateScrollUI = () => {
      const maxScroll = Math.max(nav.scrollWidth - nav.clientWidth, 0);
      const nextProgress = maxScroll > 0 ? nav.scrollLeft / maxScroll : 0;
      const widthRatio = nav.scrollWidth > 0 ? nav.clientWidth / nav.scrollWidth : 1;
      const nextThumbWidth = Math.max(18, Math.min(70, widthRatio * 100));

      setProgress(nextProgress);
      setThumbWidthPercent(nextThumbWidth);
    };

    updateScrollUI();
    nav.addEventListener('scroll', updateScrollUI, { passive: true });
    window.addEventListener('resize', updateScrollUI);

    return () => {
      nav.removeEventListener('scroll', updateScrollUI);
      window.removeEventListener('resize', updateScrollUI);
    };
  }, []);

  const thumbLeftPercent = useMemo(
    () => progress * (100 - thumbWidthPercent),
    [progress, thumbWidthPercent]
  );

  return (
    <div className="w-full sm:w-auto">
      <nav
        ref={navRef}
        className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto text-sm font-semibold sm:w-auto sm:flex-wrap"
      >
        {children}
      </nav>

      <div className="mt-2 sm:hidden">
        <div className="relative h-1 rounded-full bg-slate-200/80">
          <span
            className="absolute inset-y-0 rounded-full bg-orange-400 transition-[left,width] duration-150 ease-out"
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${thumbLeftPercent}%`,
            }}
          />
        </div>
        <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500">Geser menu untuk lihat fitur lain</p>
      </div>
    </div>
  );
}
