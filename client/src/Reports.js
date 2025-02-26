import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportFilters from "./ReportFilters";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper, FormControl, MenuItem, InputLabel, Box,  LinearProgress, CircularProgress  } from "@mui/material";
import Select from '@mui/material/Select';
import WorkHoursReport from "./WorkHoursReport";
import TaskStatusReport from "./TaskStatusReport";
import TimeTrackingReport from "./TimeTrackingReport";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportMapping = [
    {id:1, label:"Task Status", url: "task-time"},
    {id:2, label: "Work hours per user", url:"work-session"},
    { id: 3, label: "Time Tracking", url: "time-tracking" }
  ]
  const[selectedReport, setSelectedReport] = useState("");
  console.log(selectedReport,reportData)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  
  const fetchReport = async () => {
    if (!selectedReport) return;
    setLoading(true);
    setReportData(null); // Clear previous data
    try {
      const response = await axios.get(`/api/reports/${selectedReport}`, {
        params: filters,
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ padding: "10px" }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <FormControl fullWidth>
        <InputLabel>Select Report</InputLabel>
        <Select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          {reportMapping.map((report) => (
            <MenuItem key={report.id} value={report.url}>
              {report.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ReportFilters onFilterChange={handleFilterChange} />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={fetchReport}
        disabled={loading || !selectedReport}
      >
        {loading ? "Loading..." : "Generate Report"}
      </Button>

      {/* Show Spinner when loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Render the selected report dynamically */}
      {!loading && reportData && selectedReport === "task-time" && (
        <TaskStatusReport data={reportData} />
      )}
      {!loading && reportData && selectedReport === "work-session" && (
        <WorkHoursReport data={reportData} />
      )}
      {!loading && reportData && selectedReport === "time-tracking" && <TimeTrackingReport data={reportData} />}
    </Box>
  );
};

export default Reports;
// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import { Card, CardContent, Typography, Select, MenuItem, CircularProgress } from "@mui/material";
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
// import axios from "axios";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// const TimeTrackingReport = () => {
//     const [reportData, setReportData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [selectedUser, setSelectedUser] = useState("");
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         fetchReport();
//         //fetchUsers();
//     }, [selectedUser]);

//     // Fetch the report from backend
//     const fetchReport = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`/api/reports/time-tracking`, {
//                 params: { userId: selectedUser || null }
//             });
//             setReportData(response.data.timeData);
//         } catch (error) {
//             console.error("Error fetching report:", error);
//         }
//         setLoading(false);
//     };

//     // // Fetch users for filtering
//     // const fetchUsers = async () => {
//     //     try {
//     //         const response = await axios.get("/api/users"); // Update API if needed
//     //         setUsers(response.data);
//     //     } catch (error) {
//     //         console.error("Error fetching users:", error);
//     //     }
//     // };

//     // Prepare data for Chart.js
//     const chartData = {
//         labels: Object.keys(reportData),
//         datasets: [
//             {
//                 label: "Time Spent (Seconds)",
//                 data: Object.values(reportData),
//                 backgroundColor: "rgba(75, 192, 192, 0.6)",
//                 borderColor: "rgba(75, 192, 192, 1)",
//                 borderWidth: 1,
//             }
//         ]
//     };

//     return (
//         <Card sx={{ padding: 2, margin: 2 }}>
//             <CardContent>
//                 <Typography variant="h5" gutterBottom>
//                     Time Tracking Report
//                 </Typography>
                
//                 <Select
//                     value={selectedUser}
//                     onChange={(e) => setSelectedUser(e.target.value)}
//                     displayEmpty
//                     sx={{ marginBottom: 2 }}
//                 >
//                     <MenuItem value="">All Users</MenuItem>
//                     {users.map(user => (
//                         <MenuItem key={user.id} value={user.id}>
//                             {user.email}
//                         </MenuItem>
//                     ))}
//                 </Select>

//                 {loading ? (
//                     <CircularProgress />
//                 ) : (
//                     <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" }}}} />
//                 )}
//             </CardContent>
//         </Card>
//     );
// };

// export default TimeTrackingReport;
