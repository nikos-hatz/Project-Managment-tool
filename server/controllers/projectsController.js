import { db } from "../firebaseAdmin.js";

export const getProjects =async (req, res) => {
    try{
        const snapshot = await db.collection("projects").get()
        const projects = snapshot.docs.map( doc => ({id:doc.id, ...doc.data()}))
        res.status(200).json(projects)
    } catch(error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: error.message });
    }
}

export const getProject =async (req, res) => {
    const {projectId} = req.params
    try{
        const projRef  = await db.collection("projects").doc(projectId).get()
        const project = projRef.data()
        res.status(200).json(project)
    } catch(error) {
        console.error("fail to fetch project", error);
        res.status(500).json({ error: error.message });
    }
}