import { createSlice } from "@reduxjs/toolkit";

const usersStoreSlice = createSlice({
  name: "usersStore",
  initialState: {allUsers:[]},
  reducers: {
    setUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    clearUsers: (state) => {
      state.allUsers = [];
    },
  },
});

export const { setUsers, clearUsers } = usersStoreSlice.actions;
export default usersStoreSlice.reducer;
