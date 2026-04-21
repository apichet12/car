import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.warn('[Prisma] DATABASE_URL is not set. Prisma client will not be initialized.')
    return null
  }

  if (!/^(postgres(ql)?:\/\/|file:|sqlite:\/\/)/.test(url)) {
    console.warn('[Prisma] DATABASE_URL is not a supported URL. Prisma client will not be initialized.', url)
    return null
  }

  try {
    return globalForPrisma.prisma || new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.warn('[Prisma] Failed to initialize PrismaClient:', error)
    return null
  }
}

const prismaClient = createPrismaClient()
if (process.env.NODE_ENV !== 'production' && prismaClient) globalForPrisma.prisma = prismaClient

const fallbackPrisma = new Proxy<any>({}, {
  get() {
    const fn = () => {
      throw new Error('[Prisma] Client is unavailable because DATABASE_URL is missing or invalid.')
    }
    return new Proxy(fn, {
      apply() {
        throw new Error('[Prisma] Client is unavailable because DATABASE_URL is missing or invalid.')
      },
      get() {
        return this
      },
    })
  },
})

export const prisma: any = prismaClient ?? fallbackPrisma
export default prisma
