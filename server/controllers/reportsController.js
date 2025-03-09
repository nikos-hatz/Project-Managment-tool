import { db } from "../firebaseAdmin.js";

export const getTaskReport = async (req, res) => {
    try {
      const { userId, projectId, startDate, endDate } = req.query;
  
      let taskQuery = db.collection("tasks");
  
      if (userId) {
        taskQuery = taskQuery.where("assignedTo", "==", userId);
      }
      if (projectId) {
        taskQuery = taskQuery.where("projectId", "==", projectId);
      }
  
      const snapshot = await taskQuery.get();
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const filteredTasks = tasks.filter((task) => {
        const taskDate = task.deadline?.toDate?.() || new Date(task.deadline);
        if (startDate && new Date(startDate) > taskDate) return false;
        if (endDate && new Date(endDate) < taskDate) return false;
        return true;
      });
      let statusCount = {
        "To Do": 0,
        "In Progress": 0,
        "Completed": 0
    };
      const statusCounts = filteredTasks.forEach(task => {
        statusCount[task.status] = (statusCount[task.status] || 0) + 1;
    });
      res.status(200).json({ tasks: filteredTasks, statusCounts:statusCount });
    } catch (error) {
      console.error("Error fetching task report", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const getWorkSessionReport = async (req, res) => {
    try {
      const { userId, startDate, endDate } = req.query;
      let slackUserId
      let workSessionRef  = db.collection("workSessions");
      let usersRef = db.collection("users").where("uid", "==", userId)
      slackUserId = (await usersRef.get()).docs[0].data().slackUserId
      if(userId){
        workSessionRef  = workSessionRef.where("userId", "==", slackUserId);
      }
      const snapshot = await workSessionRef.get()
      let filteredEntries = snapshot.docs.map(d => d.data());
      if(startDate || endDate){
        filteredEntries= filteredEntries.filter(entry => entry.clockInTime < startDate || entry.clockInTime > endDate)
      }
      let totalHoursByUser = {}
      filteredEntries.forEach(session => {
        totalHoursByUser[session.userId] = 
            (totalHoursByUser[session.userId] || 0) + session.totalTime;
    });
    res.status(200).json(totalHoursByUser);
    }
    catch(e) {
      console.error("Error fetching work session report", e);
      res.status(500).json({ error: e.message });
    }
  
  };

  export const getTimeTrackingReport = async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;
        let workSessionRef = db.collection("tasks");

        if (userId) {
            workSessionRef = workSessionRef.where("assignedTo", "==", userId);
        }

        let taskSnap = await workSessionRef.get();
        let tasks = taskSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        if (startDate || endDate) {
            tasks = tasks.filter(task => {
                let created = task.createdAt?.toDate() || new Date();
                let afterStart = !startDate || new Date(startDate) <= created;
                let beforeEnd = !endDate || new Date(endDate) >= created;
                return afterStart && beforeEnd;
            });
        }
        
        //  converting effort to seconds
        // multiply by 86400 for day->seconds conversion
        let report = tasks.map(t => ({
            id: t.id,
            name: t.name,
            totalTimeSpentInSeconds: t.totalTimeSpentInSeconds || 0,
            effortEstimation: (t.effortEstimation || 0) * 86400,
        }));

        res.status(200).json({  tasks: report  });
    } catch (error) {
        console.error("Error fetching time tracking report", error);
        res.status(500).json({ error: error.message });
    }
};