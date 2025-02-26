import React from "react";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

const TaskStatusReport = ({ data }) => {
  const chartData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [
          data?.statusCounts?.["To Do"] || 0,
          data?.statusCounts?.["In Progress"] || 0,
          data?.statusCounts?.["Completed"] || 0,
        ],
        backgroundColor: ["#f57c00", "#0288d1", "#2e7d32"],
      },
    ],
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Task Status Report</Typography>
      <Bar data={chartData} options={{ responsive: true }} />
    </Box>
  );
};

export default TaskStatusReport;
