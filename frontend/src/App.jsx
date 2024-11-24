import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  const { data: authUser } = useQuery({
    // queryKey is used to give unique name to queries and refer to them later
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.json();

        if (data.error) {
          console.log("data error", data);
        }

        if (!res.ok) {
          throw new Error("Something went wrong!");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
