import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of PrismaClient in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // optional: logs all queries to co nsole
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma