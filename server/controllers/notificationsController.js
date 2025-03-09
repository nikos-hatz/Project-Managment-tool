import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin";

export const checkDeadlines = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const today = new Date();
        const upcomingDeadline = new Date();
        upcomingDeadline.setDate(today.getDate() + 3);

        const tasksQuery = db.collection("tasks")
            .where("assignedTo", "==", userId)
            .where("deadline", ">=", today)
            .where("deadline", "<=", upcomingDeadline);

        const tasksSnapshot = await tasksQuery.get();

        if (tasksSnapshot.empty) {
            return res.status(200).json({ notifications: [] });
        }

        const notifications = [];
        for (const doc of tasksSnapshot.docs) {
            const taskData = doc.data();
            const message = `Reminder: Task "${taskData.name}" has a deadline approaching on ${taskData.deadline.toDate().toLocaleDateString()}.`;

            const notificationRef = db.collection("notifications").doc();
            const notification = {
                userId,
                message,
                createdAt: admin.firestore.Timestamp.now(),
                read: false,
            };

            await notificationRef.set(notification);
            notifications.push({ id: notificationRef.id, ...notification });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error checking deadlines:", error);
        res.status(500).json({ error: "Failed to check deadlines." });
    }
};
