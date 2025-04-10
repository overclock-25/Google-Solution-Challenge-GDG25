export function prepareNotification(alert) {
  return {
    notification: {
        title: alert.event,
        body: alert.instruction,
    },
    data: {
        headline: alert.headline,
        severity: alert.severity,
        district: alert.district,
    },
  };
};