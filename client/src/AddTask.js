import React, { useState, useEffect } from "react";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";

const AddTask = ({ projectId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [users, setUsers] = useState([]);

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
          console.error("Error fetching projects:", error.message);
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

    try {
      const newTask = {
        name,
        description,
        projectId: selectedProject,
        assignedTo,
        status: "To Do",
        deadline: deadline ? new Date(deadline) : null,
      };

      await addDoc(collection(db, "tasks"), newTask);
      console.log("Task added successfully!");
      setName("");
      setDescription("");
      setAssignedTo("");
      setDeadline("");
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
              {user.email}
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
        <button type="submit">Add Task</button>
      </form>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
};

export default AddTask;
