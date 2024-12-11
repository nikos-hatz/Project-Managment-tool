import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import slices
import taskReducer from "./taskSlice";
import notificationsReducer from "./notificationsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    notifications: notificationsReducer
  },
});

export default store;
