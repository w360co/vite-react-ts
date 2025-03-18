import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from "../../types";

interface AuthState {
    authUser: User
}

const initialState: AuthState = {
    authUser: {
        id: '',
        name: '',
        firstname: '',
        lastname: '',
        email: '',
        refresh_token: '',
        access_token: '',
        token_type: '',
        expires_at: '',
        roles: [],
        permissions: []
    },
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
      initAuth: (state: AuthState) => {
          state.authUser = initialState.authUser
      },

      setAuth: (state: AuthState, action: PayloadAction<User>) => {
          state.authUser = { ...state.authUser, ...action.payload }
      }
  },
});

export const { initAuth, setAuth } = authSlice.actions
export default authSlice.reducer;
