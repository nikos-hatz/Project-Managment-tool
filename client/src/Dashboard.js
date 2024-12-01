import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, getDoc, doc, updateDoc, onSnapshot  } from "firebase/firestore";
import { auth, db } from "./firebase";
import KanbanBoard from "./KanbanBoard";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
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
  CircularProgress
} from "@mui/material";


const Dashboard = () => {
  const [user] = useAuthState(auth); // Get the currently logged-in user
  const [userInfo, setUserInfo] = useState({}); // Store user details
  console.log(user)
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      fetchProjects();
      fetchTasks();
    }
  }, [user, navigate]);

    // Real-time updates for projects
  const fetchProjects = () => {
    const projectsQuery = query(
      collection(db, "projects"),
      where("teamMembers", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const userProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(userProjects);
        setIsLoadingProjects(false); // Data loaded
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setIsLoadingProjects(false); // Stop loading on error
      }
    );

    return unsubscribe;
  };


  // Real-time updates for tasks
  const fetchTasks = () => {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("assignedTo", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const userTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(userTasks);
        setIsLoadingTasks(false); // Data loaded
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setIsLoadingTasks(false); // Stop loading on error
      }
    );

    return unsubscribe;
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
      console.log("Task status updated!");

      // Update tasks locally
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  // Helper function to determine the next status
const getNextStatus = (currentStatus) => {
  if (currentStatus === "To Do") return "In Progress";
  if (currentStatus === "In Progress") return "Completed";
  return "To Do"; // Loop back for simplicity
};
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user info:", error.message);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          <ListItem component={Link} to="/create-project">
            <ListItemText primary="Create Project" />
          </ListItem>
          <ListItem component={Link} to="/add-task">
            <ListItemText primary="Add Task" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        {/* Header */}
        <AppBar position="static" sx={{ mb: 3, backgroundColor: "#1976d2" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Welcome, {userInfo ? userInfo.name : user.email}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Projects Section */}
        <Typography variant="h5" gutterBottom>
          Projects
        </Typography>
        {isLoadingProjects ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No projects assigned.
          </Typography>
        ) : (
          <Grid2 container spacing={3}>
            {projects.map((project) => (
              <Grid2 xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}


        {/* Tasks Section */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Your Tasks
        </Typography>
        <Grid2 container spacing={3} style={{ display: "flex", justifyContent: "space-between" }}>
        {isLoadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress />
          </Box>
        ) : (
          ["To Do", "In Progress", "Completed"].map((status) => (
            <Grid2
              xs={12}
              sm={4} // Each column takes 1/3 of the row on medium screens and larger
              key={status}
              style={{
                minWidth: "30%", // Ensures consistent column width
                flex: "1", // Equal flex for all columns
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "8px",
                  minHeight: "300px", // Ensures each column has enough height even if empty
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
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() =>
                            updateTaskStatus(task.id, getNextStatus(task.status))
                          }
                        >
                          Move to {getNextStatus(task.status)}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Grid2>
          ))
        )}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Dashboard;
