import { getMessaging } from 'firebase-admin/messaging';
import { getNotifications } from '@/lib/firestore';
import { prepareNotification } from '@/lib/notifications';

export async function sendNotifications() {
  try {
    const notifications = await getNotifications();
    const messaging = getMessaging();

    const sendPromises = [];
    const failedNotifications = [];

    for (const district in notifications) {
        const dist_alerts = notifications[district];
        const dist_topic = "IN" + district.split(",")[0].trim();

        for (const alert of dist_alerts) {
            const payload = prepareNotification(alert);
            const message = {
                topic: dist_topic,
                notification: payload.notification,
                data: payload.data,
            };

            const sendPromise = messaging.send(message)
                .then((response) => {
                    console.log(`Successfully sent to topic '${dist_topic}':`, response);
                })
                .catch((error) => {
                    console.error(`Error sending to topic '${dist_topic}':`, error);
                    if(error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-found'){
                        console.warn(`Invalid Tokens for ${dist_topic}: ${error.message}`);
                    }
                    failedNotifications.push({ topic: dist_topic, error: error.message, alert });
                    return { success: false, topic: dist_topic, error: error.message, alert };
                });
            sendPromises.push(sendPromise);
        };
    };
    await Promise.all(sendPromises);

    return failedNotifications;
    }
    catch (error) {
        console.error('Error sending notifications:', error);
        throw error;
    }
}