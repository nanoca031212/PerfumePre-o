import { ReactNode } from 'react'
import Head from 'next/head'
import AdminSidebar from './AdminSidebar'

interface AdminShellProps {
  children: ReactNode
  title: string
}

export default function AdminShell({ children, title }: AdminShellProps) {
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
