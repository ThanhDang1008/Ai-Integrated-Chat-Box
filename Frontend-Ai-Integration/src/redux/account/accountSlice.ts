import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


export interface IInitialState {
  isAuthenticated: boolean;
  user: ISessionUser | null | undefined;
  accessToken: string | null;
}

const initialState:IInitialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,

  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.data
      state.accessToken = action.payload.token
    },
    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
     
  },
});

export const { doLoginAction,doGetAccountAction } = accountSlice.actions;

export default accountSlice.reducer;
