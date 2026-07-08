import Link from 'next/link'
import { Package, Clock, DollarSign, Mail } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import { MOCK_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/admin/orders'
import { cn } from '@/lib/utils'

export default function AdminDashboardPage() {
  const totalOrders = MOCK_ORDERS.length
  const pendingOrders = MOCK_ORDERS.filter((o) => o.status !== 'post_delivery').length
  const revenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0)
  const recentOrders = MOCK_ORDERS.slice(0, 5)

  const stats = [
    { label: 'Total de Pedidos', value: totalOrders, icon: Package },
    { label: 'Pedidos em Andamento', value: pendingOrders, icon: Clock },
    { label: 'Receita Total', value: `£${revenue.toFixed(2)}`, icon: DollarSign },
    { label: 'Emails na Automação', value: 6, icon: Mail },
  ]

  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Icon className="h-4.5 w-4.5 text-white" />
            </div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Link
          href="/login/admin/orders"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:bg-slate-900"
        >
          <h3 className="font-semibold text-white">Ver Ordens</h3>
          <p className="mt-1 text-sm text-slate-400">Acompanhe e gerencie todos os pedidos.</p>
        </Link>
        <Link
          href="/login/admin/email"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:bg-slate-900"
        >
          <h3 className="font-semibold text-white">Automação de Email</h3>
          <p className="mt-1 text-sm text-slate-400">Configure os 6 passos do fluxo de emails.</p>
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="font-semibold text-white">Pedidos Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="px-5 py-3 text-slate-200">{order.id}</td>
                  <td className="px-5 py-3 text-slate-200">{order.customer}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        ORDER_STATUS_COLORS[order.status]
                      )}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-200">£{order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
