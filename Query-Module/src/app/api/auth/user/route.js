import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid token' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userData = userDoc.data();
    
    return NextResponse.json({
      user: {
        uid,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin
      }
    });
  } catch (error) {
    console.error('User data error:', error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 401 }
    );
  }
}

