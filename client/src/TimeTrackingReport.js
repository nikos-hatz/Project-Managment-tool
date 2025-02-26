import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TimeTrackingReport = ({ data }) => {
    console.log(data)
    const chartData = {
        labels: data ? data.tasks.map((task) => task.name) : [],
        datasets: [
          {
            label: "Actual Time Spent (seconds)",
            data: data ? data.tasks.map((task) => task.totalTimeSpentInSeconds || 0) : [],
            backgroundColor: 'rgba(63, 81, 181, 0.7)',
            borderRadius: 5,
          },
          {
            label: "Effort Estimation (seconds)",
            data: data ? data.tasks.map((task) => (task.effortEstimation || 0)) : [],
            backgroundColor: 'rgba(255, 87, 34, 0.7)',
            borderRadius: 5,
          },
        ],
      };
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 14 } },
          },
          title: {
            display: true,
            text: 'Time Tracking vs. Estimated Effort',
            font: { size: 18, weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Time (Seconds)', font: { size: 14 } },
          },
          x: {
            title: { display: true, text: 'Tasks', font: { size: 14 } },
          },
        },
      };
    
      return (
        <Card sx={{ padding: 2, margin: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Time Tracking Report (Actual vs Estimated)
            </Typography>

              <Bar data={chartData} options={options} />
            
          </CardContent>
        </Card>
      );
};

export default TimeTrackingReport;
