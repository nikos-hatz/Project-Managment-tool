import { bucket } from "../firebaseAdmin.js";
import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin";

export const uploadFile = async (req, res) => {
    const file = req.file;
    const { taskId } = req.body;
    const uniqueFileName = `${Date.now()}-${file.originalname}`;

    if (!taskId) {
        return res.status(400).json({ error: "Task ID is required." });
    }

    try {
        const fileUpload = bucket.file(`uploads/${uniqueFileName}`);
        const stream = fileUpload.createWriteStream({
            metadata: { contentType: file.mimetype }
        });

        stream.on("error", (err) => {
            console.error("Upload error:", err);
            res.status(500).json({ error: err.message });
        });

        stream.on("finish", async () => {
            await fileUpload.makePublic();
            const downloadURL = `https://storage.googleapis.com/${bucket.name}/uploads/${uniqueFileName}`;
            const taskRef = db.collection("tasks").doc(taskId);
            console.log(taskRef)
            await taskRef.update({
                files: admin.firestore.FieldValue.arrayUnion({
                    name: file.originalname,
                    url: downloadURL,
                    uploadedAt: new Date(),
                }),
            });
            res.status(200).json({ success: true, downloadURL });
        });
        stream.end(file.buffer);
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getTaskFiles = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const taskRef = db.collection("tasks").doc(taskId);
        const taskSnap = await taskRef.get();

        if (!taskSnap.exists) {
            return res.status(404).json({ error: "Task not found" });
        }

        const taskData = taskSnap.data();
        const files = taskData.files || [];

        res.status(200).json({ files });
    } catch (error) {
        console.error("Error fetching task files", error);
        res.status(500).json({ error: "Failed to fetch task files" });
    }
};
