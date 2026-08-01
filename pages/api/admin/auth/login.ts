import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { createSessionCookie, setCookie } from '@/lib/admin/session'
import { getClientIp, isRateLimited, recordAttempt } from '@/lib/admin/rate-limit'

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' })
  }

  const { email, password } = req.body as { email?: unknown; password?: unknown }
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Informe email e senha' })
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL/ADMIN_PASSWORD não configurados nas variáveis de ambiente')
    return res.status(500).json({ error: 'Login administrativo não configurado' })
  }

  const success = timingSafeStringEqual(email, adminEmail) && timingSafeStringEqual(password, adminPassword)
  recordAttempt(ip, success)

  if (!success) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  setCookie(res, createSessionCookie(adminEmail))
  return res.status(200).json({ success: true })
}
