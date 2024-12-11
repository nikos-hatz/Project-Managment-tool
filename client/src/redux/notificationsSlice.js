import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    setNotifications: (state, action) => action.payload, // Replace all notifications
    addNotification: (state, action) => {
      state.push(action.payload); // Add a new notification
    },
    markAsRead: (state, action) => {
      const notification = state.find((n) => n.id === action.payload);
      if (notification) notification.read = true;
    },
    clearNotifications: () => [],
  },
});

export const { setNotifications, addNotification, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
