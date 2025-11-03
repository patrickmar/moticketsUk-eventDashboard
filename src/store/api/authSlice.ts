import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  adminId: string | null;
  user: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneno?: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  adminId: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setAdminId: (state, action: PayloadAction<string>) => {
      state.adminId = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.adminId = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthToken, setAdminId, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
