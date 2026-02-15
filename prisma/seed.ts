import "dotenv/config"
import argon2 from "argon2"
import { prisma } from "@/lib/prisma"

async function main() {
  const email = process.env.SEED_EMAIL
  const password = process.env.SEED_PASSWORD

  if (!email || !password) {
    throw new Error("Missing SEED_EMAIL or SEED_PASSWORD")
  }

  const passwordHash = await argon2.hash(password)

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash }, // re-run to rotate password
    create: { email, passwordHash },
  });

  console.log(`✔ Seeded user: ${email}`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })