import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Header from "./Components/Header";
import Home from "./Components/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserAuth } from "./fireBase/functions";
import { loginSuccess } from "./Redux/Slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Check if user is signed in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUserAuth();
        if (user) {
          dispatch(loginSuccess(user));
          console.log("user is signed in");
        } else {
          console.log("No user is signed in");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    };
    checkUser();
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <>
                {user ? (
                  <>
                    {" "}
                    <Header /> <Home />{" "}
                  </>
                ) : (
                  <Login />
                )}
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
