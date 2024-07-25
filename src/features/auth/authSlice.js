import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token; 
export const selectUsername = (state) => state.auth.username; 

export default authSlice.reducer;
