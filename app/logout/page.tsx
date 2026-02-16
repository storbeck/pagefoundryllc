"use server"

import { destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Logout() {
  await destroySession();
  redirect("/login");
}
