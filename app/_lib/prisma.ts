import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-unused-vars
  var cashedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.cashedPrisma) {
    global.cashedPrisma = new PrismaClient()
  }
  prisma = global.cashedPrisma
}

export const db = prisma
