import StorageService from '@/services/app/storage.service';
import { AuthState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      StorageService.set('user', action.payload)
      state.user = action.payload
    },
    logout: (state) => {
      StorageService.clear()
      state.user = null;
      state.isAuthenticated = false;
    },
  },

});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;