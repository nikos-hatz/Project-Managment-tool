import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChatIcon from "@mui/icons-material/Chat";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import WorkIcon from "@mui/icons-material/Work";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';

const Sidebar = () => {
    const user = useSelector((state) =>state.user)
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
          color: "#333",
          paddingTop: "10px",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "center", fontSize: "18px", fontWeight: "bold" }}>
        Project Management
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon sx={{ color: "black" }}><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/calendar">
          <ListItemIcon sx={{ color: "black" }}><CalendarMonthIcon /></ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem button component={Link} to="/reports">
          <ListItemIcon sx={{ color: "black" }}><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List>
        <ListItem button component={Link} to="/add-task">
          <ListItemIcon sx={{ color: "black" }}><PlaylistAddIcon /></ListItemIcon>
          <ListItemText primary="Add Task" />
        </ListItem>
        <ListItem button component={Link} to="/projects">
          <ListItemIcon sx={{ color: "black" }}><WorkIcon /></ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        {user.role === "Admin" && (
            <ListItem button component={Link} to="/admin" variant="contained">
                <ListItemIcon sx={{ color: "black" }}><AdminPanelSettingsOutlinedIcon /></ListItemIcon>
              Admin Panel
            </ListItem>
          )}
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List>
        <ListItem button component={Link} to="/chat">
          <ListItemIcon sx={{ color: "black" }}><ChatIcon /></ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>
        <ListItem button component={Link} to="/time-entry">
          <ListItemIcon sx={{ color: "black" }}><WorkHistoryOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Time Entry" />
        </ListItem>
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List>
        <ListItem button component={Link} to="/settings">
          <ListItemIcon sx={{ color: "black" }}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <List>
        <ListItem>
            <Notifications/>
            <ListItemIcon sx={{ color: "black" }}></ListItemIcon>
            <ListItemText primary="Notifications" />
            </ListItem>
        </List>
    </Drawer>
  );
};

export default Sidebar;
