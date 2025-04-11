import { NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";

export async function POST(token, topic) {
    if (!token || !topic) {
      return NextResponse.json({ error: 'Missing token or topic' }, { status: 400 });
    }
    const messaging = getMessaging();
    try {
      const response = await messaging.subscribeToTopic(token, topic);
      console.log(`Successfully subscribed ${token} to topic ${topic}:`, response);
      return NextResponse.json({ message: 'Successfully subscribed' }, { status: 200 });
    }
    catch (error) {
      console.error(`Error subscribing ${token} to topic ${topic}:`, error);
      return NextResponse.json({ error: 'Error subscribing to topic' }, { status: 500 });
    }
}