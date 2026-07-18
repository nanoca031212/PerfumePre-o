import { NextRequest, NextResponse } from 'next/server'

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 60

const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return true
  }
  return false
}

// Evita crescimento ilimitado do Map em instâncias de longa duração.
function cleanup() {
  const now = Date.now()
  hits.forEach((entry, key) => {
    if (now > entry.resetAt) hits.delete(key)
  })
}

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'

  if (Math.random() < 0.01) cleanup()

  if (isRateLimited(ip)) {
    return new NextResponse('Muitas requisições. Tente novamente em instantes.', { status: 429 })
  }

  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'no-referrer')
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/login/admin', '/api/admin/:path*'],
}
