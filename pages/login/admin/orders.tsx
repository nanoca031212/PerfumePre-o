import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import {
  MOCK_ORDERS,
  ORDER_STATUS_ORDER,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type Order,
  type OrderStatus,
} from '@/lib/admin/orders'
import { cn } from '@/lib/utils'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  return (
    <AdminShell title="Orders">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por pedido ou cliente..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-slate-500 focus:outline-none"
        >
          <option value="all">Todos os status</option>
          {ORDER_STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-5 py-3 text-slate-200">{order.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-slate-200">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{order.date}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={cn(
                        'rounded-full border bg-transparent px-2.5 py-0.5 text-xs font-medium focus:outline-none',
                        ORDER_STATUS_COLORS[order.status]
                      )}
                    >
                      {ORDER_STATUS_ORDER.map((status) => (
                        <option key={status} value={status} className="bg-slate-900 text-slate-200">
                          {ORDER_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-200">£{order.total.toFixed(2)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
