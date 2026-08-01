import type { NextApiRequest, NextApiResponse } from 'next'
import { isRequestAuthenticated } from '@/lib/admin/session'
import { DEFAULT_EMAIL_MESSAGES } from '@/lib/admin/email-messages'
import {
  getMessageTemplatesWithMeta,
  upsertMessageTemplate,
  resetMessageTemplate,
} from '@/lib/admin/message-templates'
import type { OrderStatus } from '@/lib/admin/orders'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isRequestAuthenticated(req)) {
    return res.status(401).json({ error: 'Não autenticado' })
  }

  if (req.method === 'GET') {
    const templates = await getMessageTemplatesWithMeta()
    return res.status(200).json({ templates })
  }

  if (req.method === 'PUT') {
    const { status, subject, body } = req.body as {
      status?: unknown
      subject?: unknown
      body?: unknown
    }

    if (
      typeof status !== 'string' ||
      !(status in DEFAULT_EMAIL_MESSAGES) ||
      typeof subject !== 'string' ||
      !subject.trim() ||
      typeof body !== 'string' ||
      !body.trim()
    ) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const template = await upsertMessageTemplate(status as OrderStatus, { subject, body })
    return res.status(200).json({ template })
  }

  if (req.method === 'DELETE') {
    const { status } = req.query as { status?: string }
    if (typeof status !== 'string' || !(status in DEFAULT_EMAIL_MESSAGES)) {
      return res.status(400).json({ error: 'Status inválido' })
    }
    await resetMessageTemplate(status as OrderStatus)
    return res.status(200).json({ success: true })
  }

  res.setHeader('Allow', 'GET, PUT, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
