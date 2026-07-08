import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const ADMIN_AUTH_KEY = 'admin_authenticated'

export function useAdminAuth() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const authed = typeof window !== 'undefined' && window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
    if (!authed) {
      router.replace('/login/admin')
      return
    }
    setIsChecking(false)
  }, [router])

  return { isChecking }
}

export function setAdminAuthenticated() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ADMIN_AUTH_KEY, 'true')
  }
}

export function clearAdminAuthenticated() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ADMIN_AUTH_KEY)
  }
}
