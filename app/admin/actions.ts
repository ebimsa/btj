"use server";

import { GalleryType } from "@prisma/client";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { clearAdminSession, requireAdmin } from "@/lib/auth";
import { normalizePhoneNumber } from "@/lib/phone-utils";
import { prisma } from "@/lib/prisma";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} wajib diisi`);
  }
  return value.trim();
}

async function saveUploadedImage(file: File, folder: "crews" | "units" | "gallery" | "hero") {
  if (!file || file.size === 0) {
    return null;
  }

  const mimeType = file.type || "";
  if (!mimeType.startsWith("image/")) {
    throw new Error("File harus berupa gambar");
  }

  const extensionFromName = path.extname(file.name || "").toLowerCase();
  const extension = extensionFromName || ".jpg";
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const relativeDir = path.join("uploads", folder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absoluteFilePath = path.join(absoluteDir, fileName);

  await mkdir(absoluteDir, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  await writeFile(absoluteFilePath, Buffer.from(arrayBuffer));

  return `/${relativeDir.replace(/\\/g, "/")}/${fileName}`;
}

async function getUploadedImageUrls(formData: FormData, key: string, folder: "crews" | "units" | "gallery" | "hero") {
  const entries = formData.getAll(key);
  const files = entries.filter((entry): entry is File => entry instanceof File);
  const uploadedUrls = await Promise.all(files.map((file) => saveUploadedImage(file, folder)));
  return uploadedUrls.filter((url): url is string => Boolean(url));
}

function parseFacilitySelections(formData: FormData) {
  const rawValues = formData
    .getAll("facilityValues")
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  const uniqueValues = Array.from(new Set(rawValues));

  return uniqueValues
    .map((value) => {
      const [icon, ...labelParts] = value.split("|");
      return {
        icon: (icon || "").trim(),
        label: labelParts.join("|").trim(),
      };
    })
    .filter((item) => item.icon.length > 0 && item.label.length > 0);
}

async function getNextSortOrder(
  model: "unit" | "crew" | "heroSlide" | "galleryItem",
  galleryType?: GalleryType
) {
  if (model === "galleryItem") {
    const result = await prisma.galleryItem.aggregate({
      where: { type: galleryType },
      _max: { sortOrder: true },
    });
    return (result._max.sortOrder ?? 0) + 1;
  }

  if (model === "unit") {
    const result = await prisma.unit.aggregate({ _max: { sortOrder: true } });
    return (result._max.sortOrder ?? 0) + 1;
  }

  if (model === "crew") {
    const result = await prisma.crew.aggregate({ _max: { sortOrder: true } });
    return (result._max.sortOrder ?? 0) + 1;
  }

  const result = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } });
  return (result._max.sortOrder ?? 0) + 1;
}

async function normalizeSortOrder(
  model: "unit" | "crew" | "heroSlide" | "galleryItem",
  galleryType?: GalleryType
) {
  if (model === "unit") {
    const rows = await prisma.unit.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true },
    });
    await prisma.$transaction(
      rows.map((row: (typeof rows)[number], index: number) =>
        prisma.unit.update({
          where: { id: row.id },
          data: { sortOrder: index + 1 },
        })
      )
    );
    return;
  }

  if (model === "crew") {
    const rows = await prisma.crew.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true },
    });
    await prisma.$transaction(
      rows.map((row: (typeof rows)[number], index: number) =>
        prisma.crew.update({
          where: { id: row.id },
          data: { sortOrder: index + 1 },
        })
      )
    );
    return;
  }

  if (model === "heroSlide") {
    const rows = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true },
    });
    await prisma.$transaction(
      rows.map((row: (typeof rows)[number], index: number) =>
        prisma.heroSlide.update({
          where: { id: row.id },
          data: { sortOrder: index + 1 },
        })
      )
    );
    return;
  }

  const rows = await prisma.galleryItem.findMany({
    where: { type: galleryType },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  await prisma.$transaction(
    rows.map((row: (typeof rows)[number], index: number) =>
      prisma.galleryItem.update({
        where: { id: row.id },
        data: { sortOrder: index + 1 },
      })
    )
  );
}

export async function logoutAdmin() {
  await requireAdmin();
  await clearAdminSession();
  redirect("/");
}

export async function createUnit(formData: FormData) {
  await requireAdmin();
  const name = requiredString(formData, "name");
  const description = requiredString(formData, "description");
  const capacity = requiredString(formData, "capacity");
  const facilities = parseFacilitySelections(formData);
  const uploadedPhotoUrls = await getUploadedImageUrls(formData, "photoFiles", "units");
  if (uploadedPhotoUrls.length === 0) {
    throw new Error("Foto unit wajib diupload minimal 1 foto");
  }
  const sortOrder = await getNextSortOrder("unit");

  const unit = await prisma.unit.create({
    data: {
      name,
      description,
      capacity,
      sortOrder,
    },
  });

  if (facilities.length > 0) {
    await prisma.unitFacility.createMany({
      data: facilities.map((facility, index) => ({
        unitId: unit.id,
        icon: facility.icon,
        label: facility.label,
        sortOrder: index + 1,
      })),
    });
  }

  await prisma.unitPhoto.createMany({
    data: uploadedPhotoUrls.map((imageUrl, index) => ({
      unitId: unit.id,
      imageUrl,
      sortOrder: index + 1,
    })),
  });

  revalidatePath("/");
  revalidatePath("/admin/units");
  redirect("/admin/units?success=Data%20unit%20berhasil%20disimpan");
}

export async function updateUnit(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  const name = requiredString(formData, "name");
  const description = requiredString(formData, "description");
  const capacity = requiredString(formData, "capacity");
  const facilities = parseFacilitySelections(formData);
  const removePhotoIds = formData
    .getAll("removePhotoIds")
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  const uploadedPhotoUrls = await getUploadedImageUrls(formData, "photoFiles", "units");

  await prisma.unit.update({
    where: { id },
    data: { name, description, capacity },
  });

  await prisma.unitFacility.deleteMany({ where: { unitId: id } });

  if (facilities.length > 0) {
    await prisma.unitFacility.createMany({
      data: facilities.map((facility, index) => ({
        unitId: id,
        icon: facility.icon,
        label: facility.label,
        sortOrder: index + 1,
      })),
    });
  }

  if (removePhotoIds.length > 0) {
    await prisma.unitPhoto.deleteMany({
      where: {
        unitId: id,
        id: { in: removePhotoIds },
      },
    });
  }

  if (uploadedPhotoUrls.length > 0) {
    const existingPhotoCount = await prisma.unitPhoto.count({ where: { unitId: id } });
    await prisma.unitPhoto.createMany({
      data: uploadedPhotoUrls.map((imageUrl, index) => ({
        unitId: id,
        imageUrl,
        sortOrder: existingPhotoCount + index + 1,
      })),
    });
  }

  const orderedPhotos = await prisma.unitPhoto.findMany({
    where: { unitId: id },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });

  if (orderedPhotos.length > 0) {
    await prisma.$transaction(
      orderedPhotos.map((photo: (typeof orderedPhotos)[number], index: number) =>
        prisma.unitPhoto.update({
          where: { id: photo.id },
          data: { sortOrder: index + 1 },
        })
      )
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/units");
  redirect("/admin/units?success=Data%20unit%20berhasil%20diperbarui");
}

export async function deleteUnit(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");

  await prisma.unit.delete({ where: { id } });
  await normalizeSortOrder("unit");

  revalidatePath("/");
  revalidatePath("/admin/units");
}

export async function createCrew(formData: FormData) {
  await requireAdmin();
  const name = requiredString(formData, "name");
  const role = requiredString(formData, "role");
  const uploadedPhotoUrls = await getUploadedImageUrls(formData, "photoFile", "crews");
  const photoUrl = uploadedPhotoUrls[0];
  if (!photoUrl) {
    throw new Error("Foto kru wajib diupload");
  }
  const sortOrder = await getNextSortOrder("crew");

  await prisma.crew.create({
    data: { name, role, photoUrl, sortOrder },
  });

  revalidatePath("/");
  revalidatePath("/admin/crews");
  redirect("/admin/crews?success=Data%20kru%20berhasil%20disimpan");
}

export async function updateCrew(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  const name = requiredString(formData, "name");
  const role = requiredString(formData, "role");
  const uploadedPhotoUrls = await getUploadedImageUrls(formData, "photoFile", "crews");
  const existingCrew = await prisma.crew.findUnique({
    where: { id },
    select: { photoUrl: true },
  });
  const photoUrl = uploadedPhotoUrls[0] || existingCrew?.photoUrl;
  if (!photoUrl) {
    throw new Error("Foto kru tidak ditemukan");
  }

  await prisma.crew.update({
    where: { id },
    data: { name, role, photoUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/crews");
  redirect("/admin/crews?success=Data%20kru%20berhasil%20diperbarui");
}

export async function deleteCrew(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  await prisma.crew.delete({ where: { id } });
  await normalizeSortOrder("crew");

  revalidatePath("/");
  revalidatePath("/admin/crews");
}

export async function createGalleryItem(formData: FormData) {
  await requireAdmin();
  const uploadedImageUrls = await getUploadedImageUrls(formData, "imageFile", "gallery");
  const imageUrl = uploadedImageUrls[0];
  if (!imageUrl) {
    throw new Error("Foto galeri wajib diupload");
  }
  const rawType = requiredString(formData, "type");
  const type = rawType === "TESTIMONIAL" ? GalleryType.TESTIMONIAL : GalleryType.MOMENT;
  const sortOrder = await getNextSortOrder("galleryItem", type);

  await prisma.galleryItem.create({
    data: { imageUrl, type, sortOrder },
  });

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?success=Item%20galeri%20berhasil%20disimpan");
}

export async function updateGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  const uploadedImageUrls = await getUploadedImageUrls(formData, "imageFile", "gallery");
  const rawType = requiredString(formData, "type");
  const type = rawType === "TESTIMONIAL" ? GalleryType.TESTIMONIAL : GalleryType.MOMENT;

  const existing = await prisma.galleryItem.findUnique({
    where: { id },
    select: { type: true, imageUrl: true },
  });

  const imageUrl = uploadedImageUrls[0] || existing?.imageUrl;
  if (!imageUrl) {
    throw new Error("Foto galeri tidak ditemukan");
  }

  const sortOrder =
    existing && existing.type !== type
      ? await getNextSortOrder("galleryItem", type)
      : undefined;

  await prisma.galleryItem.update({
    where: { id },
    data: { imageUrl, type, ...(sortOrder ? { sortOrder } : {}) },
  });

  if (existing && existing.type !== type) {
    await normalizeSortOrder("galleryItem", existing.type);
    await normalizeSortOrder("galleryItem", type);
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?success=Item%20galeri%20berhasil%20diperbarui");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  const existing = await prisma.galleryItem.findUnique({
    where: { id },
    select: { type: true },
  });
  await prisma.galleryItem.delete({ where: { id } });
  if (existing) {
    await normalizeSortOrder("galleryItem", existing.type);
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function createHeroSlide(formData: FormData) {
  await requireAdmin();
  const uploadedImageUrls = await getUploadedImageUrls(formData, "imageFile", "hero");
  const imageUrl = uploadedImageUrls[0];
  if (!imageUrl) {
    throw new Error("Foto hero wajib diupload");
  }
  const sortOrder = await getNextSortOrder("heroSlide");

  await prisma.heroSlide.create({
    data: { imageUrl, sortOrder },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=Foto%20hero%20berhasil%20ditambahkan");
}

export async function deleteHeroSlide(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  await prisma.heroSlide.delete({ where: { id } });
  await normalizeSortOrder("heroSlide");

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateSiteConfig(formData: FormData) {
  await requireAdmin();
  const heroTitle = requiredString(formData, "heroTitle");
  const heroSubtitle = requiredString(formData, "heroSubtitle");
  const heroDescription = requiredString(formData, "heroDescription");
  let whatsappNumber = requiredString(formData, "whatsappNumber");
  const whatsappLabel = requiredString(formData, "whatsappLabel");
  const locationLabel = requiredString(formData, "locationLabel");

  // Normalize nomor WhatsApp ke format +62xxxxxxxxx
  whatsappNumber = normalizePhoneNumber(whatsappNumber).replace('+', '');

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      heroTitle,
      heroSubtitle,
      heroDescription,
      whatsappNumber,
      whatsappLabel,
      locationLabel,
    },
    create: {
      id: 1,
      heroTitle,
      heroSubtitle,
      heroDescription,
      whatsappNumber,
      whatsappLabel,
      locationLabel,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=Pengaturan%20website%20berhasil%20disimpan");
}
