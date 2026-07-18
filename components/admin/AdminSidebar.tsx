import Link from 'next/link'
import { useRouter } from 'next/router'
import { LayoutDashboard, Package, Mail, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/email', label: 'Email', icon: Mail },
]

export default function AdminSidebar() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.replace('/login/admin')
  }

  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-slate-800 bg-slate-900/60 px-2 py-6 sm:w-60 sm:px-4">
      <div className="mb-8 hidden px-2 sm:block">
        <span className="text-lg font-bold text-white">Admin</span>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = router.pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors sm:justify-start',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white sm:justify-start"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Sair</span>
      </button>
    </aside>
  )
}
