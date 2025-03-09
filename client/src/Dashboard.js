import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, getDoc, doc, updateDoc, onSnapshot, addDoc  } from "firebase/firestore";
import { auth, db } from "./firebase";
import KanbanBoard from "./KanbanBoard";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications, addNotification } from "./redux/notificationsSlice";
import { addList } from "./redux/taskSlice";
import Sidebar from "./Sidebar";
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardContent,
  Toolbar,
  AppBar,
  Button,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from "axios";
import { setUsers } from "./redux/usersStoreSlice";


const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState({});
  console.log(user)
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const statuses = ["To Do", "In Progress", "Completed"];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#9c27b0",
      },
    },
  });
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchProjects();
      fetchTasks();
      fetchNotifications();
    }
  }, [user, navigate]);

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
        setIsLoadingProjects(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setIsLoadingProjects(false);
      }
    );

    return unsubscribe;
  };

  const fetchTasks = async () => {
    try {
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
  
          dispatch(addList(userTasks));
          setTasks(userTasks);
          setIsLoadingTasks(false);
        },
        (error) => {
          console.error("Error fetching tasks:", error);
        }
      );
  
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
 

  const fetchNotifications = async () => {
    try {
        const response = await axios.post("/api/notifications/check-deadlines", {
            userId: user.uid,
        });
        
        dispatch(setNotifications(response.data.notifications || []));
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus, updatedAt: new Date() })
    const taskDoc = await getDoc(taskRef);
    const taskData = taskDoc.data();
    

    await addDoc(collection(db, "notifications"), {
      userId: taskData.assignedTo,
      message: `Task "${taskData.name}" was moved to ${newStatus}.`,
      createdAt: new Date(),
      read: false,
    });

    console.log("Task status updated and notification sent!");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const response = await axios.get("api/users")
          if (response?.data) {
            const currentUser = response.data.filter(usr => usr.uid === user.uid)
            setUserInfo(currentUser.data);
            dispatch(setUsers(response?.data));
          } else {
            console.log("No user foundt");
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
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <AppBar position="static" sx={{ mb: 3, backgroundColor: "#1976d2" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Welcome, {userInfo ? userInfo.name : user.email}
            </Typography>
          </Toolbar>
        </AppBar>
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
                <Link
                  to={`/projects/${project.id}`}
                  style={{ textDecoration: "none", color: "blue" }}
                >
                <Card
                  sx={{ height: "100%", cursor: "pointer" }}
                  //onClick={() => setSelectedProjectId(project.id)}
                >                        
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
                </Link>
              </Grid2>
            ))}
          </Grid2>
        )}
         {selectedProjectId && (
          <Button onClick={() => setSelectedProjectId(null)} variant="contained" sx={{ mt: 2 }}>
            Show All Tasks
          </Button>
        )}
        <Typography variant="h5" gutterBottom>
            Your Kanban Board
        </Typography>
          {isLoadingTasks ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <CircularProgress />
            </Box>
          ) : (
            <KanbanBoard tasks={tasks} updateTaskStatus={updateTaskStatus} />
          )}
      </Box>
    </Box>
  );
};

export default Dashboard;
