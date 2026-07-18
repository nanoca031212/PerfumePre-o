import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { GetServerSidePropsContext } from 'next'

const COOKIE_NAME = 'admin_session'
const SESSION_TTL_SECONDS = 8 * 60 * 60 // 8 horas

function getSecret(): string {
  const secret = process.env.AdminSessionSecret
  if (!secret) {
    throw new Error('AdminSessionSecret não configurado no .env')
  }
  return secret
}

function serializeCookie(value: string, maxAge: number): string {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export function createSessionCookie(email: string): string {
  const token = jwt.sign({ sub: email }, getSecret(), { expiresIn: SESSION_TTL_SECONDS })
  return serializeCookie(token, SESSION_TTL_SECONDS)
}

export function clearSessionCookie(): string {
  return serializeCookie('', 0)
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false
  try {
    jwt.verify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export function isRequestAuthenticated(req: NextApiRequest): boolean {
  return verifyToken(req.cookies[COOKIE_NAME])
}

export function isSsrAuthenticated(context: GetServerSidePropsContext): boolean {
  return verifyToken(context.req.cookies[COOKIE_NAME])
}

export function setCookie(res: NextApiResponse, cookie: string) {
  res.setHeader('Set-Cookie', cookie)
}
