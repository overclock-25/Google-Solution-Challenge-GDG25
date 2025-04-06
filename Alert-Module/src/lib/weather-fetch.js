import { Timestamp } from 'firebase-admin/firestore';
export async function getWeatherAlerts (district) {
  try {
    const apiUrl = 'https://weather-soil-module.vercel.app/api/alerts';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WEATHER_API_KEY}`,
      },
      body: JSON.stringify({"dist" : district}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export function filterCurrentAlerts(current_alerts, active_alerts) {
  current_alerts = current_alerts.filter((dist) => dist.alerts.length > 0);

  const active_alerts_set = new Set(active_alerts.map(alert => alert.headline));

  const new_alerts = [];

  for (const { dist, alerts } of current_alerts) {
    const new_district_alerts = alerts.filter(alert => !active_alerts_set.has(alert.headline));

    if (new_district_alerts.length > 0) {
      new_alerts.push({ dist, alerts: new_district_alerts });
    }
  }

  return new_alerts;
}

const formatAlert = (dist, alert) => {
  try {
    return {
      district: dist,
      msgtype: alert.msgtype,
      event: alert.event,
      headline: alert.headline,
      severity: alert.severity,

      effective: Timestamp.fromDate(new Date(alert.effective)),
      expires: Timestamp.fromDate(new Date(alert.expires)),

      instruction: alert.instruction,
    };
  } catch (error) {
    console.error(`Error transforming alert for district ${dist}:`, error);
    return null;
  }
};

export function formatNewAlerts(new_alerts) {
  return new_alerts.map(({ dist, alerts }) => ({
    dist,
    alerts: alerts.map(alert => formatAlert(dist, alert)).filter(Boolean),
  }));
}

export function groupActiveAlerts(alerts) {
  return alerts.reduce((acc, alert) => {
    const dist = alert.district;
    if (!acc[dist]) acc[dist] = [];
    acc[dist].push(alert);
    return acc;
  }, {});
}
