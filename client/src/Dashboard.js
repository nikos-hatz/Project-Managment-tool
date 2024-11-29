import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [user] = useAuthState(auth); // Get the currently logged-in user
  const [userInfo, setUserInfo] = useState({}); // Store user details
  console.log(user)
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      fetchProjects();
      fetchTasks();
    }
  }, [user, navigate]);

  // Fetch projects assigned to the logged-in user
  const fetchProjects = async () => {
    try {
      const q = query(
        collection(db, "projects"),
        where("teamMembers", "array-contains", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userProjects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(userProjects);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  // Fetch tasks assigned to the logged-in user
  const fetchTasks = async () => {
    try {
      const q = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
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
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {userInfo ? userInfo.name : user.email}</h1>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/create-project">Create Project</Link>
        <Link to="/add-task">Add Task</Link>
      </nav>
      <section>
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <p>No projects assigned.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <strong>{project.name}</strong>: {project.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <strong>{task.name}</strong> - {task.status} (Deadline:{" "}
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
