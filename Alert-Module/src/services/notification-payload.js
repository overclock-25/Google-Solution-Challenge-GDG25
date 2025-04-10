import { getWeatherAlerts, filterCurrentAlerts, formatNewAlerts, groupActiveAlerts } from '@/lib/weather-fetch';
import { getDistricts, getActiveAlerts, writeNewAlerts, storeNotifications } from '@/lib/firestore';

  export async function constructNotificationPayload() {
    try {
      const all_districts = await getDistricts();

      const active_alerts = await getActiveAlerts();
      const current_alerts = await Promise.all(all_districts.map(district => getWeatherAlerts(district)));

      const new_alerts = filterCurrentAlerts(current_alerts, active_alerts);
      const formatted_alerts = formatNewAlerts(new_alerts);

      const written_alerts = await writeNewAlerts(formatted_alerts);

      const notification_payload = groupActiveAlerts(active_alerts.concat(written_alerts));

      await storeNotifications(notification_payload);

      return notification_payload;
    }
    catch (error) {
      console.error('Error updating weather alerts:', error);
      throw error;
    }
  }
