import { NextResponse } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';
import { getNotifications, getFarmsByDistrict, getFcmTokens } from '@/lib/firestore';
import { getDistrictRefs, annotateTokenstoFarms, groupFinalFarms, normalizeTimestamps, prepareNotification } from '@/lib/notifications';

export async function GET() {
  try {
    const payload = await getNotifications();

    const dist_refs = getDistrictRefs(payload);

    const farms = await Promise.all(Object.keys(dist_refs).map(dist_ref => getFarmsByDistrict(dist_ref)));

    const user_paths = Array.from(new Set(farms.flat().map(farm => farm.userRef.path)));

    const token_map = await getFcmTokens(user_paths);

    const annotated_farms = annotateTokenstoFarms(farms, token_map);

    const final_farms = groupFinalFarms(annotated_farms, dist_refs);

    for (const dist in final_farms) {
        const filtered_farms = final_farms[dist].filter(farm => farm.fcmTokens && farm.fcmTokens.length > 0);
        if (filtered_farms.length > 0) {final_farms[dist] = filtered_farms}
        else {delete final_farms[dist];}
    }
    console.log('Final farms:', final_farms);

    const final_payload = normalizeTimestamps(payload);
    console.log('Final payload:', final_payload);

    const messaging = getMessaging();
    const sendPromises = [];
    let notificationErrors = [];

    for (const district in final_farms) {
        const dist_farms = final_farms[district];
        const dist_alerts = final_payload[district];

        for (const farm of dist_farms) {
            for (const token of farm.fcmTokens) {
                for (const alert of dist_alerts) {
                    const message = prepareNotification(alert, token);
                    const sendPromise = messaging.send(message)
                            .then(response => {
                                console.log('Successfully sent message:', response);
                            })
                            .catch(error => {
                                console.error('Error sending message:', error);
                                notificationErrors.push({ token, error: error.message });
                            });
                        sendPromises.push(sendPromise);
                }
            }
        };

    }
    await Promise.all(sendPromises);

    return NextResponse.json({ message: 'Notifications sent' });
  }
  catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Notifications sending failed' }, { status: 500 });
  }
}