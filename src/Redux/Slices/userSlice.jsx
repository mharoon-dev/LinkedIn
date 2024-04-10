import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  user: null,
  loading: false,
  error: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginRequest: (state = initialState, action) => {
      state.loading = true;
      state.error = "";
      state.user = null;
      state.login = false;
    },
    loginSuccess: (state = initialState, action) => {
      state.loading = false;
      state.login = true;
      state.error = "";
      state.user = true;
      console.log(state.user);
    },
    loginFailure: (state = initialState, action) => {
      state.loading = false;
      state.login = false;
      state.user = null;
      state.error = action.payload;
    },
  },
});

const { actions, reducer } = loginSlice;

export const { loginSuccess, loginFailure, loginRequest } = actions;

export default reducer;
