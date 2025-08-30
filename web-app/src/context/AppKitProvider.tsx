'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { wagmiAdapter, projectId } from '@/config'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const queryClient = new QueryClient()

if (!projectId) throw new Error('NEXT_PUBLIC_PROJECT_ID missing')

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,

  // Wallet section parity with the demo
  enableWallets: false,                // disable injected + WC in main flow (demo has this false)
  allWallets: 'SHOW',                  // still show the "All Wallets" entry if wallets are enabled later

  // Demo-like features and ordering
  features: {
    analytics: true,                   // dashboard analytics
    swaps: false,                      // demo had swaps off
    onramp: false,                     // demo had onramp off
    email: true,                       // enable email auth
    socials: ['google', 'x', 'apple', 'facebook'],
    connectMethodsOrder: ['wallet', 'email', 'social'], // exact order from demo
    legalCheckbox: false,
    emailShowWallets: true             // keep parity with demo config
  },

  // Prevent modal from auto-opening
  enableEIP6963: false,                // Disable auto-detection of wallet extensions
  enableCoinbase: false,               // Disable auto-coinbase detection
  
  // Theme like the demo (orange accent, Inter font, color mix strength)
  themeVariables: {
    '--w3m-font-family': "Inter, var(--font-inter), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    '--w3m-accent': '#F59E0B',
    '--w3m-color-mix': '#FFFFFF',
    '--w3m-color-mix-strength': 10
  }
})

export default function AppKitProvider({
  children,
  cookies
}: { children: React.ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <div className={inter.variable}>{children}</div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}