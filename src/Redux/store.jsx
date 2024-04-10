import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slices/userSlice'

const store = configureStore(
  {
    reducer: {
      user: userSlice,
    },
  },
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
