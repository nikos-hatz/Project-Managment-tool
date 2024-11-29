import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [user] = useAuthState(auth);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newProject = {
        name,
        description,
        createdBy: user.uid,
        teamMembers: [user.uid],
        tasks: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "projects"), newProject);
      console.log("Project created successfully!");
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating project:", error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Create a New Project</h1>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit">Create Project</button>
        <nav>
        <Link to="/dashboard">View Projects</Link>
      </nav>
      </form>
    </div>
  );
};

export default CreateProject;
