import { db } from "../firebaseAdmin.js";

// Send a message
export const sendMessage = async (req, res) => {
  const { from, to, message } = req.body;

  try {
    const messageRef = db.collection("messages").doc();
    const newMessage = {
      from,
      to,
      message,
      timestamp: new Date(),
      isRead: false,
    };
    await messageRef.set(newMessage);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;
  console.log(req.params)

  try {
    const messagesQuery = db
      .collection("messages")
      .where("from", "in", [userId1, userId2])
      .where("to", "in", [userId1, userId2])
      .orderBy("timestamp", "asc");

    const snapshot = await messagesQuery.get();
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
