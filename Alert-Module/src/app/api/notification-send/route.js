import { NextResponse } from 'next/server';
import { sendNotifications } from '@/services/notification-send';

export async function POST() {
    try {
        const result = await sendNotifications();

        if(result.length > 0) {
            return NextResponse.json({error: 'Some Notifications failed', failed: result}, {status: 500});
        }
        return NextResponse.json({ message: 'Notifications sent' }, { status: 200 });
    }
    catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Notifications sending failed' }, { status: 500 });
    }
};