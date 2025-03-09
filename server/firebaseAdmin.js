import admin from "firebase-admin";

// Path to your service account key file
import serviceAccount from "./config/serviceAccountKey.json" with { type: "json" }// Adjust based on your folder structure


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "projectmanagementwebapp-32dc0.firebasestorage.app"
    });
}

const db = admin.firestore();
const bucket  = admin.storage().bucket();

export { db, bucket };
