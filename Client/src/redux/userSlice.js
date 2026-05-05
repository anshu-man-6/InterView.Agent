import { createSlice } from "@reduxjs/toolkit";

/*
  createSlice is used to create:
  - state (data)
  - reducers (functions to update state)
  - actions (automatically generated)
*/

const userSlice = createSlice({
  name: "user", // name of this slice (used internally by Redux)

  // Initial state (default data when app starts)
  initialState: {
    userData: null, // no user logged in initially
  },

  reducers: {
    // This function is used to store user data (after login or API call)
    setUserData: (state, action) => {
      // action.payload contains the data we send
      state.userData = action.payload;
    },

    // This function is used to clear user data (on logout)
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

// Export actions so we can use them in components
export const { setUserData, clearUserData } = userSlice.actions;

// Export reducer to add it into store
export default userSlice.reducer;