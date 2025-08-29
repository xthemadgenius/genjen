import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../lib/supabase';
import { UpdateUserRequest } from '../../../../types/user';

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

    // For now, just log the onboarding data and return success
    // TODO: Implement proper user session management and profile updates
    console.log('✅ Onboarding data validated and logged:', {
      user: {
        username: personalInfo.username,
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address
      },
      preferences: {
        services: selectedServices,
        plan: selectedPlan
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully! (Demo mode)',
      data: {
        personalInfo,
        selectedServices,
        selectedPlan
      }
    });

  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}