"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    redirect("/admin/login?error=Isi+username+dan+password");
  }

  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    redirect("/admin/login?error=Username+atau+password+salah");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    redirect("/admin/login?error=Username+atau+password+salah");
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}
