// import admin from 'firebase-admin';
// import { getFirestore, collection } from 'firebase-admin/firestore';
// import { NextResponse } from 'next/server';

// if (!admin.apps.length) {
//   try {
//     admin.initializeApp({
//       credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
//     });
//     console.log('Firebase Admin SDK initialized in test-db route.');
//   } catch (error) {
//     console.error('Error initializing Firebase Admin SDK in test-db route:', error);
//   }
// }

// const db = getFirestore();

// export async function GET() {
//   try {
//     console.log('Attempting to get collection in test-db route...');
//     console.log('Type of db.collection:', typeof db.collection); // Add this line
//     const districtsCollection = db.collection('districts');
//     return NextResponse.json({ message: 'Collection reference obtained in test-db route', districtsCollection: districtsCollection.path });
//   } catch (error) {
//     console.error('Error in test-db route:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }