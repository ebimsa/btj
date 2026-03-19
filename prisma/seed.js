const { PrismaClient, GalleryType } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const defaultSlides = [
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=80",
];

const defaultMoments = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
];

const defaultTestimonials = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517949908118-7210823f8a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
];

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "bangband";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { name: "BTJ Admin", passwordHash },
    create: {
      name: "BTJ Admin",
      username,
      passwordHash,
    },
  });

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitle: "Bengal Trans Jaya",
      heroSubtitle: "Sewa Bus Pariwisata Lampung",
      whatsappNumber: "6282281334100",
      whatsappLabel: "Booking: Ms Bagus",
      locationLabel: "Lampung",
    },
  });

  const slideCount = await prisma.heroSlide.count();
  if (slideCount === 0) {
    await prisma.heroSlide.createMany({
      data: defaultSlides.map((imageUrl, index) => ({ imageUrl, sortOrder: index + 1 })),
    });
  }

  const crewCount = await prisma.crew.count();
  if (crewCount === 0) {
    await prisma.crew.createMany({
      data: [
        {
          name: "Andi Pratama",
          role: "Pengemudi Utama",
          photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          sortOrder: 1,
        },
        {
          name: "Rizky Saputra",
          role: "Kru Pendamping",
          photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
          sortOrder: 2,
        },
        {
          name: "Siti Lestari",
          role: "Koordinator Lapangan",
          photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
          sortOrder: 3,
        },
      ],
    });
  }

  const unitCount = await prisma.unit.count();
  if (unitCount === 0) {
    const unit1 = await prisma.unit.create({
      data: {
        name: "Bigbus Luxury 1",
        capacity: "38-50-60 Kursi",
        description: "Armada bus besar dengan kapasitas fleksibel hingga 60 kursi.",
        sortOrder: 1,
      },
    });

    const unit2 = await prisma.unit.create({
      data: {
        name: "Medium Bus Eksklusif",
        capacity: "29-33-35 Kursi",
        description: "Unit bus berukuran sedang untuk perjalanan grup kecil-menengah.",
        sortOrder: 2,
      },
    });

    await prisma.unitFacility.createMany({
      data: [
        { unitId: unit1.id, icon: "directions_bus", label: "Bigbus (60 Seat)", sortOrder: 1 },
        { unitId: unit1.id, icon: "ac_unit", label: "AC Dingin", sortOrder: 2 },
        { unitId: unit1.id, icon: "tv", label: "Full Audio TV", sortOrder: 3 },
        { unitId: unit2.id, icon: "directions_bus", label: "Medium (35 Seat)", sortOrder: 1 },
        { unitId: unit2.id, icon: "event_seat", label: "Reclining Seat", sortOrder: 2 },
        { unitId: unit2.id, icon: "luggage", label: "Bagasi Luas", sortOrder: 3 },
      ],
    });

    await prisma.unitPhoto.createMany({
      data: [
        {
          unitId: unit1.id,
          imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1500&q=80",
          sortOrder: 1,
        },
        {
          unitId: unit1.id,
          imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1500&q=80",
          sortOrder: 2,
        },
        {
          unitId: unit2.id,
          imageUrl: "https://images.unsplash.com/photo-1572572378478-82b74f013fac?auto=format&fit=crop&w=1500&q=80",
          sortOrder: 1,
        },
        {
          unitId: unit2.id,
          imageUrl: "https://images.unsplash.com/photo-1517949908118-7210823f8a0c?auto=format&fit=crop&w=1500&q=80",
          sortOrder: 2,
        },
      ],
    });
  }

  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    await prisma.galleryItem.createMany({
      data: [
        ...defaultMoments.map((imageUrl, index) => ({
          imageUrl,
          type: GalleryType.MOMENT,
          sortOrder: index + 1,
        })),
        ...defaultTestimonials.map((imageUrl, index) => ({
          imageUrl,
          type: GalleryType.TESTIMONIAL,
          sortOrder: index + 1,
        })),
      ],
    });
  }

  console.log("Seed selesai.");
  console.log(`Admin login: ${username} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
