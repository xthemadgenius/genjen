// src/components/auth/PostAuthRouter.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKitAccount } from '@reown/appkit/react'
import { useLogout } from '../../context/LogoutContext'
import { supabase } from '../../lib/supabase'

type MeResponse = { onboarded: boolean; isNewUser: boolean }

export default function PostAuthRouter() {
  const router = useRouter()
  const { isConnected, status, address } = useAppKitAccount()
  const { isLoggingOut, recentlyLoggedOut } = useLogout()
  const [, setChecked] = useState(false)
  const once = useRef(false)

  useEffect(() => {
    // Don't process connections during logout or immediately after
    if (isLoggingOut || recentlyLoggedOut) {
      console.log('PostAuthRouter: Skipping routing due to logout state')
      return
    }
    
    // Wait until AppKit reports a real connection
    if (once.current || !isConnected || status !== 'connected' || !address) {
      // Reset the once flag if user disconnects
      if (!isConnected && once.current) {
        console.log('PostAuthRouter: User disconnected, resetting state')
        once.current = false
        setChecked(false)
      }
      return
    }

    once.current = true // prevent double runs
    
    console.log('PostAuthRouter: User connected with address:', address)
    
    // Handle wallet connection - create or find user
    ;(async () => {
      try {
        // Check if user exists with this wallet address
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', address)
          .single()
        
        if (existingUser) {
          console.log('PostAuthRouter: Existing user found, redirecting to dashboard')
          router.replace('/dashboard')
        } else {
          console.log('PostAuthRouter: New wallet user, redirecting to onboard')
          // Store wallet address for onboarding
          sessionStorage.setItem('pending_wallet_address', address)
          router.replace('/onboard')
        }
      } catch (error) {
        console.error('PostAuthRouter: Error checking user:', error)
        // Default to onboarding for new users
        sessionStorage.setItem('pending_wallet_address', address)
        router.replace('/onboard')
      } finally {
        setChecked(true)
      }
    })()
  }, [isConnected, status, address, router, isLoggingOut, recentlyLoggedOut])

  return null // no UI; purely side-effect
}