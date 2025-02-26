import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import KanbanBoard from "./KanbanBoard";
import { useParams } from "react-router"
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardContent,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Button,
  CircularProgress,
  LinearProgress
} from "@mui/material";

const ProjectDetails = () => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState([]);
  const [progressPercentage, setProgressPercetage] = useState(null);
  const { id: projectId } = useParams();
  console.log("Project ID:", projectId);
  console.log("tasks:", tasks);

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

  useEffect(() => {
    calculateProjectProgress(tasks)
  }, [tasks]);
  

  // const updateTaskStatus = async (taskId, newStatus) => {
  //   try {
  //     const taskRef = doc(db, "tasks", taskId);
  //     await updateDoc(taskRef, { status: newStatus });
  //     setTasks((prevTasks) =>
  //       prevTasks.map((task) =>
  //         task.id === taskId ? { ...task, status: newStatus } : task
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating task status:", error.message);
  //   }
  // };

  const calculateProjectProgress = (tasks) => {
    const totalEffortRequired =  tasks?.reduce((acc, task) => acc + task.effortEstimation, 0);
    const copletedTasksEstimation = tasks?.filter(task => task.status === 'Completed').reduce((acc, task) => acc + task.effortEstimation, 0);
    setProgressPercetage((copletedTasksEstimation / totalEffortRequired) * 100)
  }

  return (
    <>
    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Related Tasks for Project: {projectId}
            </Typography>
            <Grid2 container spacing={3} style={{ display: "flex", justifyContent: "space-between" }}>
      {/* <h1>Project Details</h1>
      <KanbanBoard tasks={tasks} updateTaskStatus={updateTaskStatus} /> */}
      {
      ["To Do", "In Progress", "Completed"].map((status) => (
            <Grid2
              xs={12}
              sm={4}
              key={status}
              style={{
                minWidth: "30%",
                flex: "1",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "8px",
                  minHeight: "300px",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  {status}
                </Typography>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <Card
                      key={task.id}
                      sx={{
                        mb: 2,
                        backgroundColor: "#ffffff",
                        borderLeft: `4px solid ${
                          status === "To Do"
                            ? "#f57c00"
                            : status === "In Progress"
                            ? "#0288d1"
                            : "#2e7d32"
                        }`,
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1">{task.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {task.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Grid2>
          ))
        }
    </Grid2>
    <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  margin: "10px",
                  borderRadius: "8px",
                  minHeight: "100px",
                  width: "600px"
                }}
              >
      <LinearProgress variant="determinate" value={progressPercentage} style={{borderRadius: "5px",  height: 10}} />
      <p>{Math.round(progressPercentage)}% Completed</p>
    </Box>
    </>
  );
};

export default ProjectDetails;
