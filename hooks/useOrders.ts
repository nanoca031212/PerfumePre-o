import { useEffect, useState } from 'react'
import { MOCK_ORDERS, type Order } from '@/lib/admin/orders'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data.orders)) return
        setOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.id))
          const stripeOrders = (data.orders as Order[]).filter((o) => !existingIds.has(o.id))
          return [...stripeOrders, ...prev]
        })
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { orders, setOrders, isLoading }
}
