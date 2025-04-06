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

export async function getFarmsByDistrict(dist_ref) {
  try {
    const farms_snapshot = await db.collection('farms').where('districtRef', '==', db.doc(dist_ref)).where('notification', '==', true).get();
    return farms_snapshot.docs.map(doc => doc.data());
  }
  catch (error) {
    console.error('Error getting farms for districts:', error);
    return [];
  }
}

export async function getFcmTokens(user_paths) {
  try {
    const user_refs = user_paths.map(path => db.doc(path));
    const user_docs = await db.getAll(...user_refs);

    const token_map = {};
    user_docs.forEach(doc => {
      if (doc.exists) {
        token_map[doc.ref.path] = doc.data().fcmTokens;
      }
    });

    return token_map;
  } catch (error) {
    console.error('Error fetching FCM tokens:', error);
    return {};
  }
}








// export async function getFcmTokens(user_paths) {
//   const user_refs = user_paths.map(path => db.doc(path));
//   await db.getAll(...user_refs);
// }
// export async function getFcmTokens(user_paths) {
//   const user_refs = user_paths.map(path => db.doc(path));
//   const user_docs = await db.getAll(...user_refs);

//   const token_map = {};
//   user_docs.forEach(doc => {
//       token_map[doc.ref.path] = doc.data().fcmToken;
//   });

//   return token_map;
// }

// const active_alerts_map = {};
// alerts_snapshot.docs.forEach(doc => {
//   const data = doc.data();
//   const district_code = data.district_code;  // Ensure each alert stores its district_code

//   if (!active_alerts_map[district_code]) {
//     active_alerts_map[district_code] = [];
//   }
//   active_alerts_map[district_code].push(data.headline);
// });

// return active_alerts_map;

// export async function getActiveAlerts(district_code) {
//   try {
//     const alerts_query = query(
//       collection(db, 'districts', district_code, 'alerts'),
//       where('expires', '>=', Timestamp.now())
//     );
//     const alerts_snapshot = await getDocs(alerts_query);
//     return alerts_snapshot.docs.map(doc => doc.data().headline);

//   } catch (error) {
//     console.error(`Error getting active alerts for district ${district_code}:`, error);
//     return [];
//   }
// }

// export async function writeAlertData(weather_alerts) {
//   try {
//     for (const alert of weather_alerts) {
//       const distCode = alert.dist.split(', ')[0];
//       const distDoc = await db.collection('districts').doc(distCode).get();
//       if (distDoc.exists) {
//         const alertsSubcollectionRef = distDoc.ref.collection('alerts');
//         for (const alertData of alert.alerts) {
//           await alertsSubcollectionRef.add({
//             alertType: alertData.alertType,
//             description: alertData.description,
//             startDate: alertData.startDate,
//             endDate: alertData.endDate,
//             severity: alertData.severity,
//             status: alertData.status,
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error writing alert data:', error);
//   }
// }

// export async function writeAlertData(alertData) {
//   if (alertData) {
//     if (alertData.alerts) {
//       const docRef = db.collection('weather_alerts').doc(alertData.district);
//       const docSnapshot = await docRef.get();

//       if (docSnapshot.exists) {
//         await docRef.update({
//           updated: Timestamp.now(),
//           alert: alertData.alerts,
//         });
//       } else {
//         await docRef.set({
//           district: alertData.district,
//           updated: Timestamp.now(),
//           alert: alertData.alerts,
//         });
//       }
//       return alertData.alerts;
//     } else {
//       const docRef = db.collection('weather_alerts').doc(alertData.district);
//       const docSnapshot = await docRef.get();
//       if (docSnapshot.exists && docSnapshot.data().alert !== 'No Recent Alerts' ){
//           await docRef.update({
//               updated: Timestamp.now(),
//               alert: "No Recent Alerts",
//           })
//       }
//       return null;
//     }
//   }
//   return null;
// }

// export async function getDistrictsWithAlerts() {
//   try {
//     const alertsQuery = await db
//       .collection('weather_alerts')
//       .where('alert', '!=', 'No Recent Alerts')
//       .get();

//     return alertsQuery.docs.map((doc) => ({
//       district: doc.id,
//       alert: doc.data().alert,
//     }));
//   } catch (error) {
//     console.error('Error getting districts with alerts:', error);
//     return [];
//   }
// }

// export async function getUsersByDistrict(district, alert) {
//   try {
//     const farmsQuery = await db.collection('farms').where('district', '==', district).get();
//     const farms = farmsQuery.docs.map((doc) => ({ farmId: doc.id, ...doc.data() }));

//     const userIds = farms.map((farm) => farm.userId);
//     const uniqueUserIds = [...new Set(userIds)];

//     const userPromises = uniqueUserIds.map(async (userId) => {
//       const userDoc = await db.collection('users').doc(userId).get();
//       if (userDoc.exists) {
//         const subscriptionsQuery = await db
//           .collection('subscriptions')
//           .where('userId', '==', userId)
//           .get();

//         const subscriptions = subscriptionsQuery.docs.map((doc) => ({
//           subscriptionId: doc.id,
//           ...doc.data(),
//         }));

//         return {
//           userId: userDoc.id,
//           ...userDoc.data(),
//           subscriptions: subscriptions,
//           alert: alert,
//         };
//       }
//       return null;
//     });

//     const users = (await Promise.all(userPromises)).filter(Boolean);
//     return users;
//   } catch (error) {
//     console.error(`Error getting users for district ${district}:`, error);
//     return [];
//   }
// }