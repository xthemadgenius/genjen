import { NextRequest, NextResponse } from 'next/server';
import { CreateUserRequest, CreateUserResponse, SUPPORTED_WALLET_TYPES } from '../../../../types/user';
import { UserService } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body: { email: string; password: string } = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    console.log('User signup attempt:', { email });
    
    // Create basic user with Supabase (details will be collected in onboarding)
    try {
      // Generate a temporary username from email
      const tempUsername = email.split('@')[0] + '_' + Date.now().toString().slice(-4);
      
      const user = await UserService.createUser({
        email,
        username: tempUsername, // Temporary username
        password
        // name, phone, address will be collected during onboarding
      });
      
      const userResponse: CreateUserResponse = {
        success: true,
        user,
        message: 'Account created successfully. Complete your profile to continue.',
        nextStep: 'generate_wallet'
      };
      
      return NextResponse.json(userResponse);
      
    } catch (supabaseError: any) {
      console.error('Supabase user creation failed:', supabaseError.message);
      
      // Handle specific Supabase errors
      if (supabaseError.message.includes('duplicate key value')) {
        if (supabaseError.message.includes('email')) {
          return NextResponse.json(
            { success: false, error: 'An account with this email already exists' },
            { status: 400 }
          );
        }
        if (supabaseError.message.includes('username')) {
          return NextResponse.json(
            { success: false, error: 'This username is already taken' },
            { status: 400 }
          );
        }
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // This code should not be reached due to the try/catch above
    // But included as fallback
    return NextResponse.json(
      { success: false, error: 'Unexpected error occurred' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}