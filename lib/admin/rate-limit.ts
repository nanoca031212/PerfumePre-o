import type { NextApiRequest } from 'next'

const WINDOW_MS = 5 * 60 * 1000 // 5 minutos
const MAX_FAILED_ATTEMPTS = 3

const failedAttempts = new Map<string, { count: number; windowStart: number }>()

export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

export function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip)
  if (!entry) return false
  if (Date.now() - entry.windowStart > WINDOW_MS) {
    failedAttempts.delete(ip)
    return false
  }
  return entry.count >= MAX_FAILED_ATTEMPTS
}

export function recordAttempt(ip: string, success: boolean): void {
  if (success) {
    failedAttempts.delete(ip)
    return
  }

  const entry = failedAttempts.get(ip)
  const now = Date.now()
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, windowStart: now })
  } else {
    entry.count += 1
  }
}
