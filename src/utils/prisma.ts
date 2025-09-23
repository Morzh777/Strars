import { withAccelerate } from '@prisma/extension-accelerate'

import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as { 
    prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
    return new PrismaClient().$extends(withAccelerate())
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma