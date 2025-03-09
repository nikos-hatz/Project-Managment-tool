import { db } from "../firebaseAdmin.js";

// TODO: Add task history tracking method for tasks



export const addTask = async (req, res) => {
    try {
        const { name, description, projectId, assignedTo, deadline, effortEstimation, reporter } = req.body;

        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        const taskRef = db.collection("tasks").doc();
        const taskId = taskRef.id;

        const newTask = {
            id: taskId,
            name,
            description,
            projectId,
            assignedTo,
            status: "To Do",
            deadline: deadline ? new Date(deadline) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            effortEstimation: effortEstimation ? Number(effortEstimation) : 0,
            totalTimeSpentInSeconds: 0,
            reporter:reporter,
        };

        await taskRef.set(newTask);

        const projRef  = db.collection("projects").doc(projectId);
        const projSnap  = await projRef .get();

        if (!projSnap.exists) {
            return res.status(404).json({ error: "Project not found" });
        }

        let currentTasks = projSnap.data().tasks || []
        await projRef.update({
            tasks: [...currentTasks, taskId],
        });

        res.status(201).json({ success: true, message: "Task added", task: newTask });
    } catch (error) {
        console.error("Error when adding task", error);
        res.status(500).json({ error: "Failed to add task" });
    }
};

export const logManualTime = async (req, res) => {
    try {
        const { taskId, userId, hours, minutes } = req.body;
        const totalSecs = (parseInt(hours) * 3600) + (parseInt(minutes) * 60);

    if (!taskId || !userId || isNaN(totalSecs)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    let taskRef = db.collection("tasks").doc(taskId);
    let task = await taskRef.get();

    if (!task.exists) {
        return res.status(404).json({ error: "Task not found" });
    }

    // update total time - probably should add some logging here
    await taskRef.update({
        totalTimeSpentInSeconds: (task.data().totalTimeSpentInSeconds || 0) + totalSecs
    });

    res.status(200).json({ success: true, message: "Time logged" });
} catch (error) {
    console.error( error);
    res.status(500).json({ error: "Failed to log time" })
}
};

export const addCommentToTask = async (req, res) => {
    try {
        const { taskId, userId, userName, text } = req.body;

        if (!taskId || !userId || !text) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const commentRef = db.collection("tasks").doc(taskId).collection("comments").doc();
        const newComment = {
            userId,
            userName,
            text,
            createdAt: new Date()
        };

        await commentRef.set(newComment);

        res.status(200).json({ success: true, message: "Comment added" })
    } catch (error) {
        res.status(500).json({ error: "Failed to add comment" })
    }
};

export const getCommentsForTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const commentsRef = db.collection("tasks").doc(taskId).collection("comments").orderBy("createdAt", "asc");
        let snapshot = await commentsRef.get();

    let comments = [];
    snapshot.docs.forEach(doc => {
        comments.push({
            id: doc.id,
            ...doc.data(),
        });
    });

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error( error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

export const editTaskInfo = async (req, res) => {
    try {
        let { taskId, editObject } = req.body;

        if (!taskId || !editObject || Object.keys(editObject).length === 0) {
            res.status(400).json({error:"Task ID and edit data are required"});
        }
    
        let taskRef = db.collection("tasks").doc(taskId);
        let task = await taskRef.get();
        
        if (!task.exists) {
            return res.status(404).json({ error: "Could not find Task" });
        }
    
        // handle deadline separately cuz dates need to have consistency when stored in db
        if(editObject.deadline){
            editObject = {
                ...editObject,
                deadline: new Date(editObject.deadline),
                updatedAt: new Date()
            }
        }
    
        await taskRef.update(editObject);
    
        res.status(200).json({ success: true, message: "Task edided" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to edit task" });
    }
};


