import React from "react";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

const WorkHoursReport = ({ data }) => {
  const chartData = {
    labels: Object.keys(data || {}),
    datasets: [
      {
        label: "Work Hours",
        data: Object.values(data || {}),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Work Hours Report</Typography>
      <Bar data={chartData} options={{ responsive: true }} />
    </Box>
  );
};

export default WorkHoursReport;
