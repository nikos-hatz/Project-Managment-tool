import React, { useState, useEffect } from "react";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { db } from "./firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper, FormControl, MenuItem, InputLabel, Box  } from "@mui/material";
import Select from '@mui/material/Select';

const ReportFilters = ({ onFilterChange, generateReport }) => {

    const [projects, setProjects] = useState([]);
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
            console.log('Users', users)
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
              console.log('Projects', projects)
            } catch (error) {
              console.error("Error fetching projects:", error.message);
            }
          };
      
          fetchProjects();
    
        fetchUsers();
      }, []);
  return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Users</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Select User"
          onChange={(e) => onFilterChange("userId", e.target.value)}
        >
            <MenuItem value={''}>All</MenuItem>
          {users.map((user) => (
                <MenuItem value={user.id}>{user.name}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Projects</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Selects Project"
          onChange={(e) => onFilterChange("projectId", e.target.value)}
        >
            <MenuItem value={''}>All</MenuItem>
          {projects.map((prj) => (
                <MenuItem value={prj.id}>{prj.name}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Date Range:</Typography>
                <input type="date" onChange={(e) => onFilterChange("startDate", e.target.value)} />
                <input type="date" onChange={(e) => onFilterChange("endDate", e.target.value)} />
        </Box>
            {/* <Button variant="contained" color="primary" onClick={generateReport}>
                Generate Report
            </Button> */}
      </Box>
  );
};

export default ReportFilters;
