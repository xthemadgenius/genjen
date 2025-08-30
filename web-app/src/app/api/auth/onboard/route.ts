import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personalInfo, selectedServices, selectedPlan } = body;

    console.log('Onboarding data received:', {
      personalInfo,
      selectedServices,
      selectedPlan
    });

    // Validate required personal info fields
    if (!personalInfo?.username || !personalInfo?.name?.first_name || !personalInfo?.name?.last_name) {
      return NextResponse.json(
        { success: false, error: 'Username, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (!personalInfo?.email || !personalInfo?.phone || !personalInfo?.address) {
      return NextResponse.json(
        { success: false, error: 'Email, phone, and address are required' },
        { status: 400 }
      );
    }
    
    // Validate phone number format (should be exactly 10 digits)
    const phoneDigits = personalInfo.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Get wallet address from the request
    const walletAddress = personalInfo.walletAddress;
    
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    try {
      console.log('Attempting to create user with data:', {
        email: personalInfo.email,
        username: personalInfo.username,
        name: personalInfo.name,
        phone: personalInfo.phone,
        address: personalInfo.address,
        wallet_address: walletAddress
      });
      
      // Create user in Supabase with onboarding data
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: personalInfo.email,
          username: personalInfo.username,
          name: personalInfo.name,
          phone: personalInfo.phone || null,
          address: personalInfo.address || null,
          wallet_address: walletAddress,
          is_wallet_verified: true, // Since they connected via wallet
          wallet_type: 'WalletConnect',
          membership_tier_id: selectedPlan || 'circle',
          last_wallet_connection: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error('Supabase user creation error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userData: {
            email: personalInfo.email,
            username: personalInfo.username,
            membership_tier_id: selectedPlan || 'circle',
            wallet_address: walletAddress
          }
        })
        
        // Handle specific errors
        if (error.code === '23505') {
          if (error.message.includes('username')) {
            return NextResponse.json(
              { success: false, error: 'Username already taken. Please choose another.' },
              { status: 400 }
            )
          }
          if (error.message.includes('email')) {
            return NextResponse.json(
              { success: false, error: 'Email already registered. Please use a different email.' },
              { status: 400 }
            )
          }
        }
        
        return NextResponse.json(
          { success: false, error: `Database error: ${error.message}` },
          { status: 500 }
        )
      }
      
      console.log('✅ User created in Supabase:', newUser)
      
      // Store selected services and plan as user metadata
      // TODO: Create separate tables for user preferences if needed
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully!',
        user: newUser,
        data: {
          personalInfo,
          selectedServices,
          selectedPlan
        }
      })
      // 
    } catch (dbError: any) {
      console.error('Database error during onboarding:', dbError)
      return NextResponse.json(
        { success: false, error: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}