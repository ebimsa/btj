'use client';

import { useState } from 'react';

interface HeroThumbnailProps {
  url: string;
  alt: string;
}

export default function HeroThumbnail({ url, alt }: HeroThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-40 h-24 rounded-lg overflow-hidden border border-slate-300 flex-shrink-0 bg-slate-100">
      {!hasError ? (
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-200">
          <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      )}
    </div>
  );
}
