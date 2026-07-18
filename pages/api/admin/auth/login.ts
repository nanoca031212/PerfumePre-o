import type { NextApiRequest, NextApiResponse } from 'next'
import { timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { createSessionCookie, setCookie } from '@/lib/admin/session'
import { getClientIp, isRateLimited, recordAttempt } from '@/lib/admin/rate-limit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)

  if (await isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' })
  }

  const { email, password } = req.body as { email?: unknown; password?: unknown }
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Informe email e senha' })
  }

  const adminEmail = process.env.EmailAdmin
  const adminPasswordHashB64 = process.env.PasswordAdmin

  if (!adminEmail || !adminPasswordHashB64) {
    return res.status(500).json({ error: 'Autenticação de admin não configurada' })
  }

  // PasswordAdmin é armazenado em base64 no .env — o Next.js expande "$VAR"
  // em valores de env, o que corrompe hashes bcrypt gravados em texto puro.
  const adminPasswordHash = Buffer.from(adminPasswordHashB64, 'base64').toString('utf8')

  // Comparação de email em tempo constante para evitar leak por timing.
  const emailBuf = Buffer.from(email)
  const adminEmailBuf = Buffer.from(adminEmail)
  const emailMatches =
    emailBuf.length === adminEmailBuf.length && timingSafeEqual(emailBuf, adminEmailBuf)
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash)

  const success = emailMatches && passwordMatches
  await recordAttempt(ip, success)

  if (!success) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  setCookie(res, createSessionCookie(adminEmail))
  return res.status(200).json({ success: true })
}
