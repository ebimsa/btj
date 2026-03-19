import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

const ADMIN_COOKIE = "btj_admin_session";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "change-this-secret-in-env";
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function verifyValue(value: string, signature: string) {
  const expected = signValue(value);
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

export async function createAdminSession(adminId: string) {
  const cookieStore = await cookies();
  const signature = signValue(adminId);
  cookieStore.set(ADMIN_COOKIE, `${adminId}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export const getAdminFromSession = cache(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  const [adminId, signature] = raw.split(".");
  if (!adminId || !signature || !verifyValue(adminId, signature)) {
    return null;
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { id: true, name: true, username: true },
  });

  return admin;
});

export async function requireAdmin() {
  const admin = await getAdminFromSession();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
