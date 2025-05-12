import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Home from "./Pages/Home";
import PrivateRoutes from "./Context/PrivateRoutes";
import AdminPage from "./Pages/AdminPage";
import StudentPage from "./Pages/StudentPage";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';


function App() {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider   theme={{
      focusRing: 'always', // or 'auto' / 'never'
      defaultRadius: 'md',
      primaryColor: 'teal',}}>
      <Notifications position="top-right" />

      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoutes>
                  <Home />
                </PrivateRoutes>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoutes>
                  <AdminPage />
                </PrivateRoutes>
              }
            />

            <Route
              path="/student"
              element={
                <PrivateRoutes>
                  <StudentPage />
                </PrivateRoutes>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}

export default App;
