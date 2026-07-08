import { ReactNode } from 'react'
import Head from 'next/head'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from './AdminSidebar'

interface AdminShellProps {
  children: ReactNode
  title: string
}

export default function AdminShell({ children, title }: AdminShellProps) {
  const { isChecking } = useAdminAuth()

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-white" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{title} · Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-800 px-6 py-5">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </>
  )
}
