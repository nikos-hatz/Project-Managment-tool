import { db } from "../firebaseAdmin.js";

export const getUsers =async (req, res) => {
    try{
        const snapshot = await db.collection("users").get()
        const users = snapshot.docs.map( doc => ({id:doc.id, ...doc.data()}))
        res.status(200).json(users)
    } catch(error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
}

export const getLoggedUser =async (req, res) => {
    const {userId} = req.params

    try{
        const snapshot = await db.collection("users").where("uid","==", userId).get()
        const user = snapshot.docs[0].data()
        res.status(200).json(user)
    } catch(error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
}