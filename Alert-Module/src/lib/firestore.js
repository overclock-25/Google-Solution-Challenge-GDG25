import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
  });
}

export const db = getFirestore();

export async function getDistricts() {
  try {
    const district_snapshot = await db.collection('districts').get();

    const all_districts = district_snapshot.docs.map(doc => {
      const data = doc.data();
      return `${data.code}, ${data.name}, ${data.state}`;
    });
    return all_districts;
  }
  catch (error) {
    console.error('Error getting districts:', error);
    return [];
  }
}

export async function getActiveAlerts() {
  try {
    const alerts_snapshot = await db.collectionGroup('alerts').where('expires', '>=', admin.firestore.Timestamp.now()).get();
    return alerts_snapshot.docs.map(doc => doc.data());
  }
  catch (error) {
    console.error("Error getting all active alerts:", error);
    return {};
  }
}

export async function writeNewAlerts(formatted_alerts) {

  const final_alerts = formatted_alerts.flatMap(({ dist, alerts }) => {
    const dist_doc = "IN" + dist.split(",")[0].trim();
    return alerts.map(alert => ({ dist_doc, alert }));
  });

  const batch = db.batch();
  const written_alerts = [];

  try {
    for (const { dist_doc, alert } of final_alerts) {
      const doc_ref = db.collection("districts").doc(dist_doc).collection("alerts").doc();
      batch.set(doc_ref, alert);
      written_alerts.push(alert);
    }

    await batch.commit();
    return written_alerts;
  }
  catch (error) {
    console.error("Error during batch write:", error);
    return [];
  }
}

export async function storeNotifications(notification_payload) {
  try {
    await db.collection('notifications').doc('active').set({
      payload: notification_payload,
      lastUpdated: admin.firestore.Timestamp.now()
    });
  }
  catch (error) {
    console.error("Error storing alerts:", error);
  }
}

export async function getNotifications() {
  try {
    const notification_snapshot = await db.collection('notifications').doc('active').get();
    return notification_snapshot.data().payload;
  }
  catch (error) {
    console.error("Error getting notifications:", error);
    return null;
  }
}