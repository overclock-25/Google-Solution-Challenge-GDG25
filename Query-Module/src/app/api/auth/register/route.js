import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function POST(request) {
  try {
    const { uid, email, displayName } = await request.json();
    
    // Verify the request has required data
    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await adminDb.collection('users').doc(uid).set({
      email,
      name: displayName || '',
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
