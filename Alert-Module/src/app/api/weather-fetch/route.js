import { NextResponse } from 'next/server';
import { constructNotificationPayload } from '@/services/notification-payload';

export async function POST() {
  try {
    const payload = await constructNotificationPayload();
    return NextResponse.json({ message: 'Alerts Updated', payload });
  }
  catch (error) {
    console.error('Weather fetching error:', error);
    return NextResponse.json({ error: 'Weather fetching failed' }, { status: 500 });
  }
}
