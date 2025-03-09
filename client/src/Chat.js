import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Paper, Box, TextField, Button, Typography } from "@mui/material";

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [availableUsersToChat, setAvailableUsersToChat] = useState(useSelector((state) => state.usersStore.allUsers));
  const [receiver, setReceiver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const chatEndRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    const fetchMessages = async () => {
      if (receiver) {
        try {
          const response = await axios.get(`/api/chat/fetch/${userId}/${receiver.uid}`);
          setMessages(response.data.messages);
        } catch (error) {
          console.error("Error fetching messages:", error.message);
        }
      }
    };

    fetchMessages();
  }, [userId, receiver]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    const messageToSend = {
      from: userId,
      to: receiver.uid,
      message: newMessage,
    };

    try {
      await axios.post("/api/chat/send", messageToSend);
      setMessages((prev) => [...prev, { ...messageToSend, timestamp: new Date() }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const filteredUsers = availableUsersToChat?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 1000, margin: "auto", mt: 15 }}>
      <Box>
        <TextField
          fullWidth
          label="Search user..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {isFocused && (
          <Box sx={{ position: "absolute", width: "30%", background: "white", boxShadow: 3, zIndex: 10 }}>
            {filteredUsers.map(user => (
              <Box key={user.id} sx={{ padding: 2, cursor: "pointer", "&:hover": { background: "#f0f0f0" } }} onClick={() => setReceiver(user)}>
                {user.name}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {receiver && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Chat with {receiver.name}</Typography>
          <Box sx={{ border: "1px solid #ccc", padding: 2, height: 300, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.from === userId ? "right" : "left",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "inline-block",
                    padding: "8px 12px",
                    background: msg.from === userId ? "#d1e7dd" : "#f8d7da",
                    borderRadius: "8px",
                  }}
                >
                  {msg.message}
                </Box>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Box>

          <form onSubmit={handleSendMessage} style={{ marginTop: "10px", display: "flex" }}>
            <TextField
              fullWidth
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
              Send
            </Button>
          </form>
        </>
      )}
    </Paper>
  );
};

export default Chat;
