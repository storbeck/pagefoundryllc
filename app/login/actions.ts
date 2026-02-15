"use server";

import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=invalid");

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) redirect("/login?error=invalid");

  await createSession(user.id);
  redirect("/app");
}
