import { combineReducers } from "redux";

import { userReducer } from "./userReducer.jsx";


const rootReducer = combineReducers({ 
    userState: userReducer
});

export default rootReducer