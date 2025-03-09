import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
  } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const EditTaskDialog = ({ open, onClose, task }) => {
  const [editedTask, setEditedTask] = useState({});
  const users =useSelector((state) =>state?.usersStore?.allUsers)

  useEffect(() => {
    if (task) {
      setEditedTask({
        name: task.name,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo,
        deadline: task.deadline,
        effortEstimation: task.effortEstimation,
      });
    }
  }, [task]);

  const handleEditSubmit = async () => {
    try {
      await axios.put("/api/tasks/edit", {
        taskId: task.id,
        editObject: {...editedTask, updatedAt: new Date()}
      });
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Task Name"
          value={editedTask.name}
          onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
          sx={{ mt:2, mb: 2 }}
        />
        <TextField
          fullWidth
          label="Task Description"
          multiline
          rows={3}
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ pb: 2 }}>Status</InputLabel>
          <Select
            value={editedTask.status}
            label='Status'
            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assign To</InputLabel>
          <Select
            value={editedTask.assignedTo}
            label='Assign To'
            onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Deadline"
          type="date"
          value={editedTask.deadline}
          onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleEditSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

};

export default EditTaskDialog;
