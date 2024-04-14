import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    changeLoaderState: (state = initialState) => {
      state.loading = !state.loading;
    },
  },
});

const { actions, reducer } = loaderSlice;

export const { changeLoaderState } = actions;

export default reducer;
