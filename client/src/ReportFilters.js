import React, { useState, useEffect } from "react";
import { Typography, Paper, FormControl, MenuItem, InputLabel, Box, TextField  } from "@mui/material";
import Select from '@mui/material/Select';
import { useSelector } from "react-redux";
import axios from "axios";

const ReportFilters = ({ onFilterChange, generateReport }) => {

    const [projects, setProjects] = useState([]);
    const users = useSelector((state) =>state.usersStore.allUsers || []);
    const statuses = ["To Do", "In Progress", "Completed"];
      
      

    useEffect(() => {
        const fetchProjects = async () => {
            try {
              const response = await axios.get(`/api/projects`);
              setProjects(response.data);
            } catch (error) {
              console.error("Error fetching projects:", error.message);
            }
          };
          fetchProjects();
      }, []);
  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 1600, margin: "auto",mt: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 4, width: "100%", maxWidth: 900 }}>
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Selects Project"
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
              <MenuItem value={''}>All</MenuItem>
            {statuses.map((status) => (
                  <MenuItem value={status}>{status}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", flexDirection: "row", gap:1 }}>
                  <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Date Range:</Typography>
                  <TextField type="date" onChange={(e) => onFilterChange("startDate", e.target.value)} />
                  <TextField type="date" onChange={(e) => onFilterChange("endDate", e.target.value)} />
          </Box>
      </Box>
    </Paper>
  );
};

export default ReportFilters;
