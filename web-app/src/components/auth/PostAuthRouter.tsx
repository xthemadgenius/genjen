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
        // Ask the backend who this user is & whether they finished onboarding
        const res = await fetch('/api/me', { credentials: 'include' })
        if (!res.ok) throw new Error('ME endpoint failed')
        const me: MeResponse = await res.json()

        if (me.isNewUser || !me.onboarded) {
          router.replace('/onboard')
        } else {
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