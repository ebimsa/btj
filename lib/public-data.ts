import { GalleryType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type PublicData = {
  config: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    whatsappNumber: string;
    whatsappLabel: string;
    locationLabel: string;
  };
  heroSlides: { id: string; imageUrl: string }[];
  units: {
    id: string;
    name: string;
    description: string;
    capacity: string;
    facilities: { id: string; icon: string; label: string }[];
    photos: { id: string; imageUrl: string }[];
  }[];
  crews: { id: string; name: string; role: string; photoUrl: string }[];
  moments: { id: string; imageUrl: string }[];
  testimonials: { id: string; imageUrl: string }[];
};

const fallbackData: PublicData = {
  config: {
    heroTitle: "Bengal Trans Jaya",
    heroSubtitle: "Sewa Bus Pariwisata Lampung",
    heroDescription:
      "Melayani Study Wisata, City Tour, Family Gathering, Antar Manten, Ziarah Wali, Drop-Dropan, dan berbagai perjalanan lainnya.",
    whatsappNumber: "6282281334100",
    whatsappLabel: "Booking: Ms Bagus",
    locationLabel: "Lampung",
  },
  heroSlides: [
    {
      id: "fallback-slide-1",
      imageUrl:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1800&q=80",
    },
  ],
  units: [
    {
      id: "fallback-unit-1",
      name: "Bigbus Luxury 1",
      capacity: "38-50-60 Kursi",
      description:
        "Armada bus besar dengan kapasitas fleksibel hingga 60 kursi. Pilihan tepat untuk rombongan wisata skala besar.",
      facilities: [
        { id: "f1", icon: "directions_bus", label: "Bigbus (60 Seat)" },
        { id: "f2", icon: "ac_unit", label: "AC Dingin" },
        { id: "f3", icon: "tv", label: "Full Audio TV" },
      ],
      photos: [
        {
          id: "p1",
          imageUrl:
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1500&q=80",
        },
      ],
    },
  ],
  crews: [
    {
      id: "c1",
      name: "Andi Pratama",
      role: "Pengemudi Utama",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    },
  ],
  moments: [
    {
      id: "m1",
      imageUrl:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    },
  ],
  testimonials: [
    {
      id: "t1",
      imageUrl:
        "https://images.unsplash.com/photo-1517949908118-7210823f8a0c?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

export async function getPublicData(): Promise<PublicData> {
  try {
    const [config, heroSlides, units, crews, galleryItems] = await Promise.all([
      prisma.siteConfig.findUnique({ where: { id: 1 } }),
      prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.unit.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          facilities: { orderBy: { sortOrder: "asc" } },
          photos: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.crew.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.galleryItem.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] }),
    ]);

    return {
      config: {
        heroTitle: config?.heroTitle ?? fallbackData.config.heroTitle,
        heroSubtitle: config?.heroSubtitle ?? fallbackData.config.heroSubtitle,
        heroDescription: config?.heroDescription ?? fallbackData.config.heroDescription,
        whatsappNumber: config?.whatsappNumber ?? fallbackData.config.whatsappNumber,
        whatsappLabel: config?.whatsappLabel ?? fallbackData.config.whatsappLabel,
        locationLabel: config?.locationLabel ?? fallbackData.config.locationLabel,
      },
      heroSlides: heroSlides.length
        ? heroSlides.map((slide: (typeof heroSlides)[number]) => ({ id: slide.id, imageUrl: slide.imageUrl }))
        : fallbackData.heroSlides,
      units: units.length
        ? units.map((unit: (typeof units)[number]) => ({
            id: unit.id,
            name: unit.name,
            description: unit.description,
            capacity: unit.capacity,
            facilities: unit.facilities.map((facility: (typeof unit.facilities)[number]) => ({
              id: facility.id,
              icon: facility.icon,
              label: facility.label,
            })),
            photos: unit.photos.map((photo: (typeof unit.photos)[number]) => ({
              id: photo.id,
              imageUrl: photo.imageUrl,
            })),
          }))
        : fallbackData.units,
      crews: crews.length
        ? crews.map((crew: (typeof crews)[number]) => ({
            id: crew.id,
            name: crew.name,
            role: crew.role,
            photoUrl: crew.photoUrl,
          }))
        : fallbackData.crews,
      moments: galleryItems
        .filter((item: (typeof galleryItems)[number]) => item.type === GalleryType.MOMENT)
        .map((item: (typeof galleryItems)[number]) => ({ id: item.id, imageUrl: item.imageUrl })),
      testimonials: galleryItems
        .filter((item: (typeof galleryItems)[number]) => item.type === GalleryType.TESTIMONIAL)
        .map((item: (typeof galleryItems)[number]) => ({ id: item.id, imageUrl: item.imageUrl })),
    };
  } catch {
    return fallbackData;
  }
}
