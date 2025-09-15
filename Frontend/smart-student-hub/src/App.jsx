import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import StudentLogin from "./components/StudentLogin";
import StudentRegister from "./components/StudentRegister";
import Dashboard from "./components/Dashboard";
import PersonalAchievements from "./components/PersonalAchievements";
import api from "./services/api";

function App() {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedStudentData = localStorage.getItem("studentData");
    if (savedStudentData) {
      setStudentData(JSON.parse(savedStudentData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (data) => {
    setStudentData(data);
    localStorage.setItem("studentData", JSON.stringify(data));
  };

  const handleLogout = () => {
    setStudentData(null);
    localStorage.removeItem("studentData");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={studentData ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={
            studentData ? (
              <Navigate to="/dashboard" />
            ) : (
              <StudentLogin onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            studentData ? (
              <Navigate to="/dashboard" />
            ) : (
              <StudentRegister onRegister={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            studentData ? (
              <Dashboard studentData={studentData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/personal-achievements"
          element={
            studentData ? (
              <PersonalAchievements studentData={studentData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
