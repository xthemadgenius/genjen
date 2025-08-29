import { createClient } from '@supabase/supabase-js'
import { User, CreateUserRequest, UpdateUserRequest, UserResponse } from '../types/user'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          name: { first_name: string; last_name: string } | null
          phone: string | null
          address: string | null
          wallet_address: string | null
          ens_name: string | null
          is_wallet_verified: boolean
          wallet_type: string
          last_wallet_connection: string | null
          membership_tier_id: string
          membership_assigned_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          name?: { first_name: string; last_name: string } | null
          phone?: string | null
          address?: string | null
          wallet_address?: string | null
          ens_name?: string | null
          is_wallet_verified?: boolean
          wallet_type?: string
          last_wallet_connection?: string | null
          membership_tier_id?: string
          membership_assigned_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          name?: { first_name: string; last_name: string } | null
          phone?: string | null
          address?: string | null
          wallet_address?: string | null
          ens_name?: string | null
          is_wallet_verified?: boolean
          wallet_type?: string
          last_wallet_connection?: string | null
          membership_tier_id?: string
          membership_assigned_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      membership_tiers: {
        Row: {
          id: string
          name: string
          price: number
          features: string[]
          created_at: string
        }
        Insert: {
          id: string
          name: string
          price: number
          features: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          features?: string[]
          created_at?: string
        }
      }
    }
  }
}

// Helper functions for user operations
export class UserService {
  /**
   * Create a new user in Supabase
   */
  static async createUser(userData: CreateUserRequest & { password: string }): Promise<UserResponse> {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) {
      throw new Error(`Auth signup failed: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user')
    }

    // Then create user profile
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        username: userData.username,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        wallet_type: 'WalletConnect',
        membership_tier_id: '1'
      })
      .select(`
        *,
        membership_tiers:membership_tier_id (
          id,
          name,
          price,
          features
        )
      `)
      .single()

    if (error) {
      throw new Error(`User profile creation failed: ${error.message}`)
    }

    return this.transformDbUserToResponse(data)
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<UserResponse | null> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        membership_tiers:membership_tier_id (
          id,
          name,
          price,
          features
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`)
    }

    return this.transformDbUserToResponse(data)
  }

  /**
   * Update user profile
   */
  static async updateUser(id: string, updates: UpdateUserRequest): Promise<UserResponse> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        membership_tiers:membership_tier_id (
          id,
          name,
          price,
          features
        )
      `)
      .single()

    if (error) {
      throw new Error(`User update failed: ${error.message}`)
    }

    return this.transformDbUserToResponse(data)
  }

  /**
   * Update wallet information
   */
  static async updateWallet(id: string, walletAddress: string, isVerified = false): Promise<UserResponse> {
    const { data, error } = await supabase
      .from('users')
      .update({
        wallet_address: walletAddress,
        is_wallet_verified: isVerified,
        last_wallet_connection: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        membership_tiers:membership_tier_id (
          id,
          name,
          price,
          features
        )
      `)
      .single()

    if (error) {
      throw new Error(`Wallet update failed: ${error.message}`)
    }

    return this.transformDbUserToResponse(data)
  }

  /**
   * Transform database user to API response format
   */
  private static transformDbUserToResponse(dbUser: any): UserResponse {
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      name: dbUser.name,
      phone: dbUser.phone,
      address: dbUser.address,
      walletAddress: dbUser.wallet_address,
      ensName: dbUser.ens_name,
      isWalletVerified: dbUser.is_wallet_verified,
      walletType: dbUser.wallet_type,
      lastWalletConnection: dbUser.last_wallet_connection,
      membershipTier: dbUser.membership_tiers ? {
        id: dbUser.membership_tiers.id,
        name: dbUser.membership_tiers.name,
        price: dbUser.membership_tiers.price,
        features: dbUser.membership_tiers.features
      } : undefined,
      membershipAssignedAt: dbUser.membership_assigned_at,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at
    }
  }
}

export default supabase