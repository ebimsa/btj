'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  imageUrl: string;
}

interface GalleryShowcaseProps {
  moments: GalleryItem[];
  testimonials: GalleryItem[];
}

const MAX_MOMENTS = 6;
const MAX_TESTIMONIALS = 4;

export default function GalleryShowcase({ moments, testimonials }: GalleryShowcaseProps) {
  const [showAllMoments, setShowAllMoments] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const visibleMoments = useMemo(
    () => (showAllMoments ? moments : moments.slice(0, MAX_MOMENTS)),
    [moments, showAllMoments]
  );

  const visibleTestimonials = useMemo(
    () => (showAllTestimonials ? testimonials : testimonials.slice(0, MAX_TESTIMONIALS)),
    [testimonials, showAllTestimonials]
  );

  return (
    <>
      <div className="mb-10">
        <h3 className="mb-2 text-xl font-black text-slate-900 sm:text-2xl">Galeri Momen</h3>
        <p className="text-sm font-medium text-slate-600">Momen ditampilkan terlebih dahulu dengan layout cinematic.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {visibleMoments.map((item, idx) => (
          <div key={item.id} className="group relative aspect-video overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <Image
              src={item.imageUrl}
              alt={`Galeri Momen Bengal Trans Jaya ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {moments.length > MAX_MOMENTS && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllMoments((prev) => !prev)}
            className="rounded-xl border border-orange-300 bg-orange-50 px-5 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-100"
          >
            {showAllMoments ? 'Tampilkan lebih sedikit' : 'Lihat lebih banyak'}
          </button>
        </div>
      )}

      <div className="mb-10 mt-14">
        <h3 className="mb-2 text-xl font-black text-slate-900 sm:text-2xl">Galeri Testimoni</h3>
        <p className="text-sm font-medium text-slate-600">Foto testimoni ditampilkan setelah momen dengan layout grid padat.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {visibleTestimonials.map((item, idx) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all hover:shadow-lg">
            <Image
              src={item.imageUrl}
              alt={`Testimoni Bengal Trans Jaya ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {testimonials.length > MAX_TESTIMONIALS && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllTestimonials((prev) => !prev)}
            className="rounded-xl border border-orange-300 bg-orange-50 px-5 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-100"
          >
            {showAllTestimonials ? 'Tampilkan lebih sedikit' : 'Lihat lebih banyak'}
          </button>
        </div>
      )}
    </>
  );
}
