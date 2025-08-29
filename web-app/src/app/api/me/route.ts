// app/api/me/route.ts
import { NextResponse } from 'next/server'

type UserStatus = {
  onboarded: boolean
  isNewUser: boolean
}

// Helper function to get user from session/database
async function getUserFromSession(): Promise<{ 
  id: string
  address?: string
  onboarded?: boolean
  createdAt?: Date
  updatedAt?: Date
} | null> {
  // TODO: Replace with your actual session/auth logic
  // This could be:
  // - Reading from cookies/session
  // - Querying your database based on wallet address
  // - Using your existing auth system
  
  // For now, return mock data to demonstrate the flow
  // In real implementation, you would:
  // 1. Get wallet address from AppKit session/cookie
  // 2. Query your database for user with that address
  // 3. Return user data or null if not found
  
  return null // Replace with actual user lookup
}

export async function GET(): Promise<NextResponse<UserStatus>> {
  try {
    // Get user from session/database
    const user = await getUserFromSession()
    
    if (!user) {
      // No user found - treat as new user
      return NextResponse.json({ 
        onboarded: false, 
        isNewUser: true 
      }, { status: 200 })
    }

    // Determine if user is new (just created) vs existing
    const isNewUser = !user.createdAt || 
      !user.updatedAt || 
      user.createdAt.getTime() === user.updatedAt.getTime()

    // Check if user completed onboarding
    const onboarded = !!user.onboarded

    return NextResponse.json({
      onboarded,
      isNewUser
    }, { status: 200 })

  } catch (error) {
    console.error('Error in /api/me:', error)
    
    // On error, default to treating as new user to be safe
    return NextResponse.json({
      onboarded: false,
      isNewUser: true
    }, { status: 200 })
  }
}