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
    
    console.log('PostAuthRouter: User connected with address:', address)
    
    // For now, redirect new connections to onboarding
    // TODO: Implement proper user status checking once auth system is complete
    console.log('PostAuthRouter: Redirecting to /onboard')
    router.replace('/onboard')
    
    setChecked(true)
  }, [isConnected, status, address, router])

  return null // no UI; purely side-effect
}