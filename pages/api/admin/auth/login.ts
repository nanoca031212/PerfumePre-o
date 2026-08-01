import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionCookie, setCookie } from '@/lib/admin/session'
import { getClientIp, isRateLimited, recordAttempt } from '@/lib/admin/rate-limit'

// Hash "dummy" usado quando o email não existe, para que bcrypt.compare
// sempre rode e o tempo de resposta não revele se o email é válido.
const DUMMY_HASH = '$2b$10$C6UzMDM.H6dfI/f/IKcEeOowSgV9BvV.gU4mSCTHVAQAWpwHPjVzS'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)

  try {
    if (await isRateLimited(ip)) {
      return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' })
    }

    const { email, password } = req.body as { email?: unknown; password?: unknown }
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'Informe email e senha' })
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } })
    const passwordMatches = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH)

    const success = Boolean(admin) && passwordMatches
    await recordAttempt(ip, success)

    if (!success) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    setCookie(res, createSessionCookie(admin!.email))
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Erro no login admin:', err)
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Erro interno ao autenticar' })
  }
}
