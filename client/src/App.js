import React from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from './ProtectedRoute'
import { Navigate } from "react-router-dom";
import SignUp from "./SignUp";
import CreateProject from "./CreateProject";
import AddTask from "./AddTask";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
  
    // const createCollections = async () => {
    //   try {
    //     // Add a sample user
    //     const userRef = await addDoc(collection(db, "users"), {
    //       name: "John Doe",
    //       email: "john.doe@example.com",
    //       role: "Contributor",
    //       createdAt: serverTimestamp(),
    //     });
    //     console.log("User added with ID:", userRef.id);
  
    //     // Add a sample project
    //     const projectRef = await addDoc(collection(db, "projects"), {
    //       name: "Website Redesign",
    //       description: "Redesign the company website for better UX.",
    //       createdBy: userRef.id,
    //       teamMembers: [userRef.id],
    //       tasks: [],
    //       createdAt: serverTimestamp(),
    //     });
    //     const timeLogsRef = await addDoc(collection(db, "timeLogs"), {
    //       userId: "user2",
    //       taskId: "task1",
    //       startTime: serverTimestamp(),
    //       endTime: null, // End time can be updated later
    //     });
    //     const tasksRef = await addDoc(collection(db, "tasks"), {
    //       name: "Design Homepage",
    //       projectId: "project1",
    //       assignedTo: "user2",
    //       status: "To Do",
    //       deadline: "2024-12-01",
    //       timeLogs: [],
    //       files: [],
    //     });
    //     console.log("Task added with ID:", timeLogsRef.id);
    //     console.log("Time log added with ID:", tasksRef.id);
    //     console.log("Project added with ID:", projectRef.id);
    //   } catch (e) {
    //     console.error("Error creating collections:", e);
    //   }
    // };
  
    // return (
    //   <div>
    //     <button onClick={createCollections}>Create Collections</button>
    //   </div>
    // );
  
  
}

export default App;