import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress, Typography, Box, Card, CardContent } from "@mui/material";
import axios from "axios";

const ManualTimeEntry = ({ userId }) => {
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const tasks = useSelector((state) => state.tasks.list);
    console.log(tasks)


    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = tasks.filter(task => task.name.toLowerCase().includes(value));
        setFilteredTasks(filtered);
    };

    const handleSubmit = async () => {
        if (!selectedTask || !hours || !minutes) {
            setMessage("Please fill all fields.");
            return;
        }

        try {
            const response = await axios.post("/api/tasks/log-time", {
                taskId: selectedTask,
                userId,
                hours,
                minutes
            });

            if (response.data.success) {
                setMessage("Time logged successfully!");
                setHours("");
                setMinutes("");
                setSelectedTask("");
            }
        } catch (error) {
            setMessage("Failed to log time.");
            console.error(error);
        }
    };

    return (
        <Card sx={{ padding: 3, margin: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Manual Time Entry
                </Typography>

                {loading ? <CircularProgress /> : (
                    <>

                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel>Select Task</InputLabel>
                            <Select
                                value={selectedTask}
                                onChange={(e) => setSelectedTask(e.target.value)}
                            >
                                {tasks.map(task => (
                                    <MenuItem key={task.id} value={task.id}>
                                        {task.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box display="flex" gap={2} sx={{ marginBottom: 2 }}>
                            <TextField
                                label="Hours"
                                type="number"
                                variant="outlined"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                            />
                            <TextField
                                label="Minutes"
                                type="number"
                                variant="outlined"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                            />
                        </Box>

                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                            Log Time
                        </Button>

                        {message && (
                            <Typography color={message.includes("success") ? "green" : "red"} sx={{ marginTop: 2 }}>
                                {message}
                            </Typography>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default ManualTimeEntry;
