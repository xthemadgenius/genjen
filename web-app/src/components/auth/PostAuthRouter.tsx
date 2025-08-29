// src/components/auth/PostAuthRouter.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKitAccount } from '@reown/appkit/react'

type MeResponse = { onboarded: boolean; isNewUser: boolean }

export default function PostAuthRouter() {
  const router = useRouter()
  const { isConnected, status, address } = useAppKitAccount()
  const [, setChecked] = useState(false)
  const once = useRef(false)

  useEffect(() => {
    // Wait until AppKit reports a real connection
    if (once.current || !isConnected || status !== 'connected' || !address) return

    once.current = true // prevent double runs
    ;(async () => {
      try {
        // Pass wallet address to the API to determine user status
        const apiUrl = `/api/me?address=${encodeURIComponent(address)}`
        const res = await fetch(apiUrl, { credentials: 'include' })
        if (!res.ok) throw new Error('ME endpoint failed')
        const me: MeResponse = await res.json()

        console.log('PostAuthRouter: User status', { address, me })

        if (me.isNewUser || !me.onboarded) {
          console.log('PostAuthRouter: Redirecting to /onboard')
          router.replace('/onboard')
        } else {
          console.log('PostAuthRouter: Redirecting to /dashboard')
          router.replace('/dashboard')
        }
      } catch (e) {
        // If backend not ready, stay put (no redirect). Log for debugging.
        console.error('post-auth routing error', e)
      } finally {
        setChecked(true)
      }
    })()
  }, [isConnected, status, address, router])

  return null // no UI; purely side-effect
}