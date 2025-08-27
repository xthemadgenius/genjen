'use client';

import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import React, { useEffect, useState } from 'react';

// Validate environment variables
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_PROJECT_ID is required but not found in environment variables. ' +
    'Please add it to your .env.local file.'
  );
}

// App metadata
const metadata = {
  name: 'JenGen',
  description: 'Bridging Generations Through AI-Powered Learning & Mentorship',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://jengen.ai',
  icons: ['/jengenwhite.png']
};

// React Query client for Wagmi
const queryClient = new QueryClient();

interface AppKitProviderProps {
  children: React.ReactNode;
}

// Initialize AppKit on client side immediately
let wagmiAdapter: WagmiAdapter;
let isAppKitCreated = false;

// Client-side initialization function
function initializeAppKit() {
  if (typeof window !== 'undefined' && !isAppKitCreated) {
    try {
      // Create Wagmi adapter
      wagmiAdapter = new WagmiAdapter({
        networks: [mainnet, arbitrum],
        projectId: projectId!,
      });

      // Create AppKit instance
      createAppKit({
        adapters: [wagmiAdapter],
        projectId: projectId!,
        networks: [mainnet, arbitrum],
        metadata,
        features: {
          email: true,
          socials: ['google', 'apple', 'facebook'],
          emailShowWallets: false, // Show email/social first, not wallets
          analytics: true
        },
        allWallets: 'HIDE', // Completely hide wallet options
        themeMode: 'light',
        themeVariables: {
          '--w3m-font-family': 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          '--w3m-accent': '#8b5cf6',
          '--w3m-color-mix': '#8b5cf6',
          '--w3m-color-mix-strength': 20,
          '--w3m-font-size-master': '16px',
          '--w3m-border-radius-master': '12px',
        }
      });

      isAppKitCreated = true;
    } catch (error) {
      console.error('Failed to initialize AppKit:', error);
    }
  }
}

// Initialize immediately if we're on client side
if (typeof window !== 'undefined') {
  initializeAppKit();
}

export function AppKitProvider({ children }: AppKitProviderProps) {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    // Ensure AppKit is initialized on client side
    if (!isAppKitCreated) {
      initializeAppKit();
    }
    setIsClientSide(true);
  }, []);

  // Don't render children on server side or before client initialization
  if (!isClientSide) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Initializing...
      </div>
    );
  }

  // Ensure wagmiAdapter is available before rendering
  if (!wagmiAdapter) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitProvider;