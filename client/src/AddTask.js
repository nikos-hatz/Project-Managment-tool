import React, { useState, useEffect } from "react";
import { collection, addDoc, query, getDocs, where, setDoc, updateDoc, arrayUnion, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

const AddTask = () => {
  const user = useSelector((state) =>state.user)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimation, setEstimation] = useState(null);
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [taskId, setTaskId] = useState(null)
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    const fetchProjects = async () => {
        try {
          const q = query(collection(db, "projects"));
          const querySnapshot = await getDocs(q);
          const projectList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectList);
          
        } catch (error) {
          console.error("Error fetching projects:", error.message)
        }
      };
  
      fetchProjects();

    fetchUsers();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
        alert("Please select a project.");
        return;
    }

    const taskRef = doc(collection(db, "tasks"));
    const taskId = taskRef.id;

    try {
        const newTask = {
            id: taskId,
            name,
            description,
            projectId: selectedProject,
            assignedTo,
            status: "To Do",
            deadline: deadline ? new Date(deadline) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            effortEstimation: estimation ? Number(estimation) : 0,
            totalTimeSpentInSeconds: 0,
            reporter:user.userInfo.name
        };
        await setDoc(taskRef, newTask);
        console.log(selectedProject);

        const projectDocRef = doc(db, "projects", selectedProject)
        const projectSnapshot = await getDoc(projectDocRef)
        if (!projectSnapshot.exists()) {
            console.error("No project found with the selected ID.")
            alert("No project found. Please select a valid project.")
            return
        }
        await updateDoc(projectDocRef, {
            tasks: arrayUnion(taskId),
        });
        if (file) {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("taskId", taskId)

            try {
                setUploading(true);
                const response = await axios.post("/api/files/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                setMessage("File uploaded successfully: " + response.data.downloadURL)
            } catch (error) {
                setMessage("Error uploading file: " + error.message)
            } finally {
                setUploading(false);
            }
        }

        console.log("Task added successfully!")
        setName("")
        setDescription("")
        setAssignedTo("")
        setDeadline("")
        setEstimation(null)
    } catch (error) {
        console.error("Error adding task:", error.message);
    }
};

  
  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleAddTask}>
      <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          required
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <br />
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <br />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        >
          <option value="">Assign to</option>
          {users.map((user) => (
            <option key={user.id} value={user.uid}>
              {user.name}: {user.email}
            </option>
          ))}
        </select>
        <br />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Effort Estimation"
          value={estimation}
          onChange={(e) => setEstimation(e.target.value)}
          required
        />
        Days
        <br />
        <button type="submit">Add Task</button>
      </form>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <div className="flex flex-col items-center p-4 border rounded-xl shadow-md w-full max-w-md">
      <label className="cursor-pointer flex flex-col items-center gap-2 mb-4">
        <CloudUploadIcon fontSize="large" />
        <span>Click to select a file</span>
        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>

      {file && (
        <p className="mb-2 text-sm">Selected File: {file.name}</p>
      )}
    </div>
    </div>
  )
}

export default AddTask;
