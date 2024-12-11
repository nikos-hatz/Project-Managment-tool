import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAsRead } from "./redux/notificationsSlice";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Notifications = () => {
  const notifications = useSelector((state) =>
    state.notifications.filter((n) => !n.read)
  );
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            {notification.message}
          </MenuItem>
        ))}
        {notifications.length === 0 && (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Notifications;
