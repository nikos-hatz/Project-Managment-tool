import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import slices
import taskReducer from "./taskSlice";
import notificationsReducer from "./notificationsSlice";
import usersStoreReducer from "./usersStoreSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    notifications: notificationsReducer,
    usersStore: usersStoreReducer
  },
});

export default store;
