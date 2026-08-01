import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  ORDER_STATUS_ORDER,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from "@/lib/admin/orders";
import { requireAdminAuth } from "@/lib/admin/require-auth";
import { cn } from "@/lib/utils";

const STEPS = ORDER_STATUS_ORDER.filter((status) => status !== "Completed");

interface TemplateEntry {
  subject: string;
  body: string;
  customized: boolean;
}

type TemplateMap = Partial<Record<OrderStatus, TemplateEntry>>;

type SaveState = "idle" | "saving" | "saved" | "error";

export const getServerSideProps = requireAdminAuth();

export default function AdminMessagesPage() {
  const [templates, setTemplates] = useState<TemplateMap>({});
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({});
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const [loading, setLoading] = useState(true);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/message-templates");
      const data = await res.json();
      const loaded = data.templates as TemplateMap;
      setTemplates(loaded);
      setDrafts(
        Object.fromEntries(
          Object.entries(loaded).map(([status, tpl]) => [
            status,
            { subject: tpl!.subject, body: tpl!.body },
          ]),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const updateDraft = (status: OrderStatus, field: "subject" | "body", value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [status]: { ...prev[status], [field]: value },
    }));
  };

  const handleSave = async (status: OrderStatus) => {
    const draft = drafts[status];
    if (!draft || !draft.subject.trim() || !draft.body.trim()) return;

    setSaveState((prev) => ({ ...prev, [status]: "saving" }));
    try {
      const res = await fetch("/api/admin/message-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, subject: draft.subject, body: draft.body }),
      });
      if (!res.ok) throw new Error();

      setTemplates((prev) => ({
        ...prev,
        [status]: { subject: draft.subject, body: draft.body, customized: true },
      }));
      setSaveState((prev) => ({ ...prev, [status]: "saved" }));
      setTimeout(() => setSaveState((prev) => ({ ...prev, [status]: "idle" })), 2000);
    } catch {
      setSaveState((prev) => ({ ...prev, [status]: "error" }));
    }
  };

  const handleReset = async (status: OrderStatus) => {
    setSaveState((prev) => ({ ...prev, [status]: "saving" }));
    try {
      const res = await fetch(`/api/admin/message-templates?status=${status}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await loadTemplates();
      setSaveState((prev) => ({ ...prev, [status]: "idle" }));
    } catch {
      setSaveState((prev) => ({ ...prev, [status]: "error" }));
    }
  };

  return (
    <AdminShell title="Mensagens">
      <p className="mb-5 text-sm text-slate-400">
        Personalize o assunto e o texto de cada etapa do email enviado aos clientes. Use{" "}
        <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-slate-300">
          {"{{name}}"}
        </code>{" "}
        para inserir o nome do cliente automaticamente.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">Carregando...</p>
      ) : (
        <div className="space-y-4">
          {STEPS.map((status) => {
            const draft = drafts[status];
            const template = templates[status];
            if (!draft || !template) return null;
            const state = saveState[status] ?? "idle";

            return (
              <div
                key={status}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        ORDER_STATUS_COLORS[status],
                      )}
                    >
                      {ORDER_STATUS_LABELS[status]}
                    </span>
                    {template.customized && (
                      <span className="text-xs text-slate-500">personalizado</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {template.customized && (
                      <button
                        type="button"
                        onClick={() => handleReset(status)}
                        disabled={state === "saving"}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restaurar padrão
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSave(status)}
                      disabled={state === "saving"}
                      className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {state === "saving"
                        ? "Salvando..."
                        : state === "saved"
                          ? "Salvo!"
                          : "Salvar"}
                    </button>
                  </div>
                </div>

                {state === "error" && (
                  <p className="mb-3 text-xs text-red-400">Erro ao salvar. Tente novamente.</p>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Assunto
                    </label>
                    <input
                      type="text"
                      value={draft.subject}
                      onChange={(e) => updateDraft(status, "subject", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Mensagem
                    </label>
                    <textarea
                      value={draft.body}
                      onChange={(e) => updateDraft(status, "body", e.target.value)}
                      rows={5}
                      className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
