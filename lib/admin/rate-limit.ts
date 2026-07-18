import type { NextApiRequest } from 'next'
import { prisma } from '@/lib/prisma'

const WINDOW_MS = 15 * 60 * 1000 // 15 minutos
const MAX_FAILED_ATTEMPTS = 5

export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

export async function isRateLimited(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS)
  const failedAttempts = await prisma.loginAttempt.count({
    where: { ip, success: false, createdAt: { gte: since } },
  })
  return failedAttempts >= MAX_FAILED_ATTEMPTS
}

export async function recordAttempt(ip: string, success: boolean): Promise<void> {
  await prisma.loginAttempt.create({ data: { ip, success } })
}
