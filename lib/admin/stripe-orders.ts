import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import type { Order, OrderItem } from './orders'

export function formatAddress(address: Stripe.Address | null | undefined): string | null {
  if (!address) return null
  const parts = [address.line1, address.line2, address.city, address.state, address.postal_code, address.country]
    .filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : null
}

export interface PaidSessionDetails {
  name: string
  email: string
  phone: string | null
  address: string | null
  purchasedAt: Date
  items: OrderItem[]
}

export async function getPaidSessionDetails(session: Stripe.Checkout.Session): Promise<PaidSessionDetails> {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  })

  const items: OrderItem[] = lineItems.data.map((item) => {
    const product = item.price?.product
    const name =
      typeof product === 'object' && product && 'name' in product ? product.name : item.description || 'Produto'
    return { name, quantity: item.quantity ?? 1 }
  })

  return {
    name: session.customer_details?.name || 'Cliente',
    email: session.customer_details?.email || '',
    phone: session.customer_details?.phone ?? null,
    address: formatAddress(session.customer_details?.address),
    purchasedAt: new Date(session.created * 1000),
    items,
  }
}

export async function getPaidStripeOrders(limit = 50): Promise<Order[]> {
  const sessions = await stripe.checkout.sessions.list({ limit })

  const paidSessions = sessions.data.filter((session) => session.payment_status === 'paid')

  const orders = await Promise.all(
    paidSessions.map(async (session): Promise<Order> => {
      const details = await getPaidSessionDetails(session)

      return {
        id: session.id,
        customer: details.name,
        email: details.email,
        date: details.purchasedAt.toISOString().slice(0, 10),
        total: (session.amount_total ?? 0) / 100,
        status: 'order_confirmed',
        phone: details.phone,
        address: details.address,
        items: details.items,
      }
    })
  )

  return orders.sort((a, b) => (a.date < b.date ? 1 : -1))
}
