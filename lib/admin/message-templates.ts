import { prisma } from '@/lib/prisma'
import { DEFAULT_EMAIL_MESSAGES, type EmailMessageTemplate } from './email-messages'
import type { OrderStatus } from './orders'

export type MessageTemplateMap = Partial<Record<OrderStatus, EmailMessageTemplate>>

export async function getEffectiveMessageTemplates(): Promise<MessageTemplateMap> {
  const overrides = await prisma.messageTemplate.findMany()
  const merged: MessageTemplateMap = { ...DEFAULT_EMAIL_MESSAGES }

  for (const override of overrides) {
    const status = override.status as OrderStatus
    if (!(status in DEFAULT_EMAIL_MESSAGES)) continue
    merged[status] = { subject: override.subject, body: override.body }
  }

  return merged
}

export async function getMessageTemplatesWithMeta(): Promise<
  Partial<Record<OrderStatus, EmailMessageTemplate & { customized: boolean }>>
> {
  const overrides = await prisma.messageTemplate.findMany()
  const overrideByStatus = new Map(overrides.map((o) => [o.status, o]))
  const result: Partial<Record<OrderStatus, EmailMessageTemplate & { customized: boolean }>> = {}

  for (const [status, template] of Object.entries(DEFAULT_EMAIL_MESSAGES) as [
    OrderStatus,
    EmailMessageTemplate,
  ][]) {
    const override = overrideByStatus.get(status)
    result[status] = override
      ? { subject: override.subject, body: override.body, customized: true }
      : { ...template, customized: false }
  }

  return result
}

export async function upsertMessageTemplate(
  status: OrderStatus,
  template: EmailMessageTemplate
) {
  return prisma.messageTemplate.upsert({
    where: { status },
    create: { status, subject: template.subject, body: template.body },
    update: { subject: template.subject, body: template.body },
  })
}

export async function resetMessageTemplate(status: OrderStatus) {
  await prisma.messageTemplate.deleteMany({ where: { status } })
}
