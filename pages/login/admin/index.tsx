import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Lock, ShieldCheck } from 'lucide-react'
import { setAdminAuthenticated } from '@/hooks/useAdminAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAdminAuthenticated()
    router.push('/login/admin/dashboard')
  }

  return (
    <>
      <Head>
        <title>Admin Login</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Acesso Administrativo</h1>
            <p className="mt-1 text-sm text-slate-400">Área restrita. Autenticação por senha em breve.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@perfumepreco.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                Senha
                <span className="text-xs font-normal text-slate-500">(em breve)</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  disabled
                  placeholder="••••••••"
                  className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-500 placeholder:text-slate-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200 disabled:opacity-60"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
