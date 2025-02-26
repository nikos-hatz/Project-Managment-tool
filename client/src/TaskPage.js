import React, { useState, useEffect }  from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { deepPurple } from "@mui/material/colors";
import TaskTimer from "./TaskTimer";
import Comments from "./Comments";

const TaskPage = ({ tasks }) => {
  const { taskId } = useParams();
  const task = tasks.find((t) => t.id === taskId);
  const [timeSpentOnTask, setTimeSpentOnTask] = useState(0)
  const [tabValue, setTabValue] = useState(0);

  console.log(task)

  if (!task) {
    return <h2>Task not found</h2>;
  }

    const estimationInSeconds = task.effortEstimation * 24 * 60 * 60;
    const timeSpent = task.totalTimeSpentInSeconds || 0;
    const progressPercentage = Math.min((timeSpent / estimationInSeconds) * 100, 100);

  return (
    <Box sx={{ padding: "20px", display: "flex", flexDirection: "column", gap: 2 }}>
      <Card sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5">{task.name}</Typography>
        <Box>
          <Button variant="contained" startIcon={<EditIcon />} sx={{ marginRight: 1 }}>
            Edit
          </Button>
          <Button variant="outlined" startIcon={<AssignmentIcon />}>
            Assign to me
          </Button>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Details</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip label={task.status} color="primary" />
                <Chip label={`Priority: ${task.priority || "Medium"}`} color="warning" />
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {task.description}
              </Typography>
            </CardContent>
          </Card>
          {task.files && task.files.length > 0 && (
            <Card sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h6">Attachments</Typography>
                <List>
                  {task.files.map((file, index) => (
                    <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <ListItemText primary={file.name} />
                      <IconButton component="a" href={file.url} download target="_blank" rel="noopener noreferrer">
                        <DownloadIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
          <Card sx={{ marginTop: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Comments" icon={<CommentIcon />} />
              <Tab label="Work Log" />
              <Tab label="History" />
            </Tabs>
            <CardContent>
              {tabValue === 0 && <Comments taskId={taskId} />}
              {tabValue === 1 && <Typography>Work log details here.</Typography>}
              {tabValue === 2 && <Typography>Task history details here.</Typography>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">People</Typography>
              <Typography variant="body2">
                <strong>Assignee:</strong>{" "}
                {task.assignedTo ? (
                  <Chip avatar={<Avatar sx={{ bgcolor: deepPurple[500] }}>{task.assignedTo[0]}</Avatar>} label={task.assignedTo} />
                ) : (
                  "Unassigned"
                )}
              </Typography>
              <Typography variant="body2">
                <strong>Reporter:</strong> {task.reporter || "Unknown"}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">Dates</Typography>
              <Typography variant="body2">
                <strong>Created:</strong> {new Date(task.createdAt?.seconds * 1000).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Updated:</strong> {new Date(task.updatedAt?.seconds * 1000).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Deadline:</strong>{" "}
                {task.deadline ? new Date(task.deadline?.seconds * 1000).toLocaleDateString() : "No deadline"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ marginTop: 2, padding: 2 }}>
        <Typography variant="h6">Time Tracking</Typography>
        <TaskTimer taskId={taskId} taskName={task.name} />
      </Card>
    </Box>
  );
};

export default TaskPage;
