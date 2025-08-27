// src/context/AppKitProvider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'
import { wagmiAdapter, projectId } from '@/config'
import { createAppKit } from '@reown/appkit/react' // NOTE: '/react' import
import { mainnet, arbitrum } from '@reown/appkit/networks'
import React from 'react'

const queryClient = new QueryClient()

// Create AppKit modal ONCE at module scope
createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId!,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  features: {
    email: true,
    socials: ['google','apple','facebook'],
    emailShowWallets: false
  },
  allWallets: 'HIDE'
})

export default function AppKitProvider({
  children,
  cookies
}: { children: React.ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}