import type { NextApiRequest, NextApiResponse } from 'next'
import { getPaidStripeOrders } from '@/lib/admin/stripe-orders'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const orders = await getPaidStripeOrders()
    return res.status(200).json({ orders })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao buscar pedidos na Stripe' })
  }
}
