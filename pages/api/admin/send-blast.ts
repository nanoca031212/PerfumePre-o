import type { NextApiRequest, NextApiResponse } from 'next'
import { getMailTransport } from '@/lib/admin/mailer'
import { renderEmailBody } from '@/lib/admin/email-messages'
import { renderEmailTemplate, renderEmailBodyHtml } from '@/lib/admin/email-template'
import { getEffectiveMessageTemplates } from '@/lib/admin/message-templates'
import { isRequestAuthenticated } from '@/lib/admin/session'
import type { OrderStatus } from '@/lib/admin/orders'

interface OrderPayload {
  id: string
  email: string
  name: string
  status: OrderStatus
}

interface SendResult {
  orderId: string
  email: string
  success: boolean
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isRequestAuthenticated(req)) {
    return res.status(401).json({ error: 'Não autenticado' })
  }

  const { orders } = req.body as { orders?: OrderPayload[] }
  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: 'Informe ao menos um pedido em "orders"' })
  }

  const templates = await getEffectiveMessageTemplates()
  const eligible = orders.filter((order) => templates[order.status])
  if (eligible.length === 0) {
    return res.status(200).json({ sent: 0, total: 0, results: [] })
  }

  let transport
  try {
    transport = getMailTransport()
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao configurar SMTP' })
  }

  const results: SendResult[] = await Promise.all(
    eligible.map(async (order) => {
      const template = templates[order.status]!
      try {
        await transport.sendMail({
          from: process.env.SMTP_USER,
          to: order.email,
          subject: template.subject,
          text: renderEmailBody(template.body, order.name),
          html: renderEmailTemplate(renderEmailBodyHtml(template.body, order.name)),
        })
        return { orderId: order.id, email: order.email, success: true }
      } catch (err) {
        return {
          orderId: order.id,
          email: order.email,
          success: false,
          error: err instanceof Error ? err.message : 'Erro desconhecido',
        }
      }
    })
  )

  const sent = results.filter((r) => r.success).length

  return res.status(200).json({ sent, total: results.length, results })
}
