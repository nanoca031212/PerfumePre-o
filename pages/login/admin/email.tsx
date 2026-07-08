import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { EMAIL_AUTOMATION_STEPS } from '@/lib/admin/email-steps'
import { cn } from '@/lib/utils'

interface StepConfig {
  enabled: boolean
  delayHours: number
}

const STORAGE_KEY = 'admin_email_automation'

function defaultConfig(): Record<string, StepConfig> {
  return Object.fromEntries(
    EMAIL_AUTOMATION_STEPS.map((step) => [step.id, { enabled: true, delayHours: 0 }])
  )
}

export default function AdminEmailPage() {
  const [config, setConfig] = useState<Record<string, StepConfig>>(defaultConfig)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setConfig({ ...defaultConfig(), ...JSON.parse(stored) })
      } catch {
        // ignore malformed storage
      }
    }
  }, [])

  const updateStep = (id: string, patch: Partial<StepConfig>) => {
    setConfig((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
    setSaved(false)
  }

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    setSaved(true)
  }

  return (
    <AdminShell title="Email">
      <p className="mb-6 max-w-2xl text-sm text-slate-400">
        Fluxo de automação com 6 passos, disparado conforme o status do pedido evolui. Ative ou
        desative cada etapa e defina o atraso de envio após a etapa anterior.
      </p>

      <div className="relative max-w-2xl">
        {EMAIL_AUTOMATION_STEPS.map((step, index) => {
          const stepConfig = config[step.id] ?? { enabled: true, delayHours: 0 }
          const Icon = step.icon
          const isLast = index === EMAIL_AUTOMATION_STEPS.length - 1

          return (
            <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-slate-800" />
              )}
              <div
                className={cn(
                  'z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  stepConfig.enabled
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-slate-800 bg-slate-900 text-slate-600'
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div
                className={cn(
                  'flex-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-opacity',
                  !stepConfig.enabled && 'opacity-50'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Passo {index + 1}
                    </p>
                    <h3 className="text-base font-semibold text-white">
                      {step.title}
                      {step.subtitle && (
                        <span className="ml-2 text-sm font-normal text-slate-400">
                          {step.subtitle}
                        </span>
                      )}
                    </h3>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={stepConfig.enabled}
                      onChange={(e) => updateStep(step.id, { enabled: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-700 transition-colors peer-checked:bg-emerald-500" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>

                <p className="mt-2 text-sm text-slate-400">{step.description}</p>

                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs text-slate-500">Enviar após</label>
                  <input
                    type="number"
                    min={0}
                    value={stepConfig.delayHours}
                    onChange={(e) => updateStep(step.id, { delayHours: Number(e.target.value) })}
                    disabled={!stepConfig.enabled}
                    className="w-16 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-xs text-slate-500">horas da etapa anterior</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
        >
          Salvar automação
        </button>
        {saved && <span className="text-sm text-emerald-400">Salvo.</span>}
      </div>
    </AdminShell>
  )
}
