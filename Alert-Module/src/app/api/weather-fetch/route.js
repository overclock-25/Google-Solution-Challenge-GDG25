import { NextResponse } from 'next/server';
import { getWeatherAlerts, filterCurrentAlerts, formatNewAlerts, groupActiveAlerts } from '@/lib/weather-fetch';
import { getDistricts, getActiveAlerts, writeNewAlerts, storeNotifications } from '@/lib/firestore';

export async function GET() {
  try {
    const all_districts = await getDistricts();

    const active_alerts = await getActiveAlerts();

    const current_alerts = await Promise.all(all_districts.map(district => getWeatherAlerts(district)));
    console.log('Current alerts:', current_alerts);

    const new_alerts = filterCurrentAlerts(current_alerts, active_alerts);

    const formatted_alerts = formatNewAlerts(new_alerts);

    const written_alerts = await writeNewAlerts(formatted_alerts);

    const notification_payload = groupActiveAlerts(active_alerts.concat(written_alerts));

    await storeNotifications(notification_payload);

    console.log('Written alerts:', written_alerts);
    console.log('Notification payload:', notification_payload);

    return NextResponse.json({ message: 'Alerts Updated' });
  } catch (error) {
    console.error('Weather fetching error:', error);
    return NextResponse.json({ error: 'Weather fetching failed' }, { status: 500 });
  }
}
