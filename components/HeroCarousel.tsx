'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSlide {
  id: string;
  imageUrl: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  heroTitle: string;
  heroSubtitle: string;
  locationLabel: string;
  heroDescription: string;
  whatsappLabel: string;
  whatsappNumber: string;
}

export default function HeroCarousel({
  slides,
  heroTitle,
  heroSubtitle,
  locationLabel,
  heroDescription,
  whatsappLabel,
  whatsappNumber,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti foto setiap 5 detik

    return () => clearInterval(interval);
  }, [mounted, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <header id="beranda" className="relative flex min-h-[620px] items-end overflow-hidden pt-28 sm:min-h-[720px]">
      {/* Carousel Images */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((item, index) => (
          <Image
            key={item.id}
            src={item.imageUrl}
            alt="Hero Bengal Trans Jaya"
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-all duration-[1600ms] ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
          />
        ))}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/60 to-transparent" />

      {/* Slide Indicators Dots */}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:bottom-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-orange-500 w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ke slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 md:flex-row md:items-end md:justify-between md:pb-24">
        <div className="max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-orange-500 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white sm:text-xs">
            {heroSubtitle}
          </span>
          <h1 className="mb-5 text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            {heroTitle}
            <br />
            <span className="text-orange-500">{locationLabel}</span>
          </h1>
          <p className="mb-8 max-w-xl text-base text-slate-200 sm:text-lg">{heroDescription}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-base font-black text-white shadow-xl hover:bg-orange-600 transition-all duration-200"
            >
              {whatsappLabel}
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <a
              href="#unit"
              className="inline-flex justify-center rounded-xl border border-white/35 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
            >
              Lihat Armada
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
