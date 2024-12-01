import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import KanbanBoard from "./KanbanBoard";
import { useParams } from "react-router"

const ProjectDetails = () => {
  const [tasks, setTasks] = useState([]);
  const { id: projectId } = useParams(); // 'id' should match the route parameter in App.js
  console.log("Project ID:", projectId); // Check if this logs the correct projectId

  useEffect(() => {
    if (projectId) {
      const fetchTasks = () => {
        const q = query(
          collection(db, "tasks"),
          where("projectId", "==", projectId)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const projectTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(projectTasks);
        });
  
        return () => unsubscribe();
      };
  
      fetchTasks();
    }
  }, [projectId]);
  

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  return (
    <div>
      <h1>Project Details</h1>
      <KanbanBoard tasks={tasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default ProjectDetails;
