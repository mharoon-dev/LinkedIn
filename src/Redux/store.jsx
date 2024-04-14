import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import loaderSlice from "./Slices/loaderSlice";

const store = configureStore(
  {
    reducer: {
      user: userSlice,
      loader : loaderSlice,
    },
  },
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
