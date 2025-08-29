// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server'

type UserStatus = {
  onboarded: boolean
  isNewUser: boolean
  address?: string
}

// Simple in-memory user store for demo purposes
// In production, replace this with your actual database/session logic
const userStore = new Map<string, {
  address: string
  onboarded: boolean
  createdAt: Date
  lastLoginAt: Date
}>()

// Helper function to get wallet address from request
async function getWalletAddressFromRequest(request: NextRequest): Promise<string | null> {
  // In a real implementation, you would:
  // 1. Get the wallet address from AppKit session/cookie
  // 2. Or from your authentication system
  // 3. Or from request headers/body
  
  // For now, check if there's an address in query params or headers for testing
  const url = new URL(request.url)
  const addressFromQuery = url.searchParams.get('address')
  const addressFromHeader = request.headers.get('x-wallet-address')
  
  return addressFromQuery || addressFromHeader || null
}

// Simulate user lookup based on context clues
async function determineUserStatus(walletAddress: string | null): Promise<UserStatus> {
  // If no address, treat as new user
  if (!walletAddress) {
    return {
      onboarded: false,
      isNewUser: true
    }
  }

  // Check our simple store first
  if (userStore.has(walletAddress)) {
    const user = userStore.get(walletAddress)!
    return {
      onboarded: user.onboarded,
      isNewUser: false, // Existing user if in store
      address: walletAddress
    }
  }

  // For demonstration purposes, let's simulate different user types:
  // - If address starts with '0x1', treat as existing onboarded user
  // - If address starts with '0x2', treat as existing but not onboarded
  // - Everything else as new user
  
  if (walletAddress.toLowerCase().startsWith('0x1')) {
    // Simulate existing onboarded user
    const user = {
      address: walletAddress,
      onboarded: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastLoginAt: new Date()
    }
    userStore.set(walletAddress, user)
    
    return {
      onboarded: true,
      isNewUser: false,
      address: walletAddress
    }
  } else if (walletAddress.toLowerCase().startsWith('0x2')) {
    // Simulate existing but not onboarded user
    const user = {
      address: walletAddress,
      onboarded: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      lastLoginAt: new Date()
    }
    userStore.set(walletAddress, user)
    
    return {
      onboarded: false,
      isNewUser: false,
      address: walletAddress
    }
  }

  // Default: new user
  return {
    onboarded: false,
    isNewUser: true,
    address: walletAddress
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<UserStatus>> {
  try {
    // Get wallet address from request context
    const walletAddress = await getWalletAddressFromRequest(request)
    
    // Determine user status based on available information
    const userStatus = await determineUserStatus(walletAddress)
    
    console.log('API /me called:', { walletAddress, userStatus })
    
    return NextResponse.json(userStatus, { status: 200 })

  } catch (error) {
    console.error('Error in /api/me:', error)
    
    // On error, default to treating as new user to be safe
    return NextResponse.json({
      onboarded: false,
      isNewUser: true
    }, { status: 200 })
  }
}

// For testing purposes - allow POST to simulate different user scenarios
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { address, onboarded = false, simulate } = body
    
    if (simulate && address) {
      // Store simulated user data
      userStore.set(address, {
        address,
        onboarded,
        createdAt: new Date(Date.now() - (onboarded ? 30 : 7) * 24 * 60 * 60 * 1000),
        lastLoginAt: new Date()
      })
      
      return NextResponse.json({ success: true, message: 'User simulated' })
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}