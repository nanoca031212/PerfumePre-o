import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  ORDER_STATUS_ORDER,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from "@/lib/admin/orders";
import { DEFAULT_EMAIL_MESSAGES } from "@/lib/admin/email-messages";
import { useOrders } from "@/hooks/useOrders";
import { requireAdminAuth } from "@/lib/admin/require-auth";
import { cn } from "@/lib/utils";

type BlastState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "done"; sent: number; total: number }
  | { status: "error"; message: string };

export const getServerSideProps = requireAdminAuth();

export default function AdminEmailPage() {
  const { orders, setOrders } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>(
    ORDER_STATUS_ORDER[0],
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [blast, setBlast] = useState<BlastState>({ status: "idle" });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const allFilteredSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedIds.has(order.id));

  const eligibleSelectedCount = orders.filter(
    (order) => selectedIds.has(order.id) && DEFAULT_EMAIL_MESSAGES[order.status],
  ).length;

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const toggleSelected = (orderId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allFilteredSelected) {
        const next = new Set(prev);
        filteredOrders.forEach((order) => next.delete(order.id));
        return next;
      }
      const next = new Set(prev);
      filteredOrders.forEach((order) => next.add(order.id));
      return next;
    });
  };

  const handleSendBlast = async () => {
    const payload = orders
      .filter((order) => selectedIds.has(order.id))
      .map((order) => ({
        id: order.id,
        email: order.email,
        name: order.customer,
        status: order.status,
      }));
    if (payload.length === 0) return;

    setBlast({ status: "sending" });
    try {
      const res = await fetch("/api/admin/send-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Falha ao enviar mensagens");
      }

      const successfulIds = new Set(
        (data.results as { orderId: string; success: boolean }[])
          .filter((r) => r.success)
          .map((r) => r.orderId),
      );

      setOrders((prev) =>
        prev.map((order) => {
          if (!successfulIds.has(order.id)) return order;
          const currentIndex = ORDER_STATUS_ORDER.indexOf(order.status);
          const nextStatus =
            ORDER_STATUS_ORDER[
              Math.min(currentIndex + 1, ORDER_STATUS_ORDER.length - 1)
            ];
          return { ...order, status: nextStatus };
        }),
      );

      setBlast({ status: "done", sent: data.sent, total: data.total });
    } catch (err) {
      setBlast({
        status: "error",
        message: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  return (
    <AdminShell title="Email">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-wrap gap-2">
          {ORDER_STATUS_ORDER.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition-colors focus:outline-none",
                statusFilter === status
                  ? ORDER_STATUS_COLORS[status]
                  : "border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white",
              )}
            >
              {ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-white"
                  />
                </th>
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-800/60 last:border-0"
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleSelected(order.id)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-white"
                    />
                  </td>
                  <td className="px-5 py-3 text-slate-200">{order.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-slate-200">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                    {order.items && order.items.length > 0 && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                      </p>
                    )}
                    {order.address && (
                      <p className="mt-0.5 text-xs text-slate-600">{order.address}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{order.date}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      className={cn(
                        "rounded-full border bg-transparent px-2.5 py-0.5 text-xs font-medium focus:outline-none",
                        ORDER_STATUS_COLORS[order.status],
                      )}
                    >
                      {ORDER_STATUS_ORDER.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-slate-900 text-slate-200"
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-200">
                    £{order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {blast.status === "done" && (
        <div className="fixed bottom-24 right-6 z-50 rounded-lg border border-emerald-500/30 bg-slate-900 px-3 py-2 text-xs text-emerald-400 shadow-lg">
          Enviado para {blast.sent}/{blast.total} pedidos.
        </div>
      )}
      {blast.status === "error" && (
        <div className="fixed bottom-24 right-6 z-50 rounded-lg border border-red-500/30 bg-slate-900 px-3 py-2 text-xs text-red-400 shadow-lg">
          {blast.message}
        </div>
      )}

      <button
        type="button"
        onClick={handleSendBlast}
        disabled={eligibleSelectedCount === 0 || blast.status === "sending"}
        title="Disparar mensagem para os pedidos selecionados"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg shadow-black/40 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-5 w-5" />
        {selectedIds.size > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-semibold text-white">
            {selectedIds.size}
          </span>
        )}
      </button>
    </AdminShell>
  );
}
