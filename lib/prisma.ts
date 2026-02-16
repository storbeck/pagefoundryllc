import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/client"

const connectionString = `${process.env.DATABASE_URL}`
const isLocalHost =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

const adapter = new PrismaPg({ 
  connectionString,
  ssl: isLocalHost ? false : { rejectUnauthorized: false }
})
const prisma = new PrismaClient({ adapter })

export { prisma }
