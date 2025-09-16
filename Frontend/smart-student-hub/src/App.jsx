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
import StudentProfile from "./components/StudentProfile";
import ViewProfile from "./components/ViewProfile";
import Projects from "./components/Projects";
import TeacherLogin from "./components/TeacherLogin";
import TeacherRegister from "./components/TeacherRegister";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminDashboard from "./components/AdminDashboard";
import api from "./services/api";

function App() {
  const [studentData, setStudentData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedStudentData = localStorage.getItem("studentData");
    const savedTeacherData = localStorage.getItem("teacherData");
    const savedAdminData = localStorage.getItem("adminData");
    if (savedStudentData) {
      setStudentData(JSON.parse(savedStudentData));
    }
    if (savedTeacherData) {
      setTeacherData(JSON.parse(savedTeacherData));
    }
    if (savedAdminData) {
      setAdminData(JSON.parse(savedAdminData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (data) => {
    setStudentData(data);
    localStorage.setItem("studentData", JSON.stringify(data));
  };

  const handleTeacherLogin = (data) => {
    setTeacherData(data);
    localStorage.setItem("teacherData", JSON.stringify(data));
  };

  const handleLogout = () => {
    setStudentData(null);
    localStorage.removeItem("studentData");
  };

  const handleTeacherLogout = () => {
    setTeacherData(null);
    localStorage.removeItem("teacherData");
  };

  const handleAdminLogin = (data) => {
    setAdminData(data);
    localStorage.setItem("adminData", JSON.stringify(data));
  };

  const handleAdminLogout = () => {
    setAdminData(null);
    localStorage.removeItem("adminData");
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
        <Route
          path="/profile"
          element={
            studentData ? (
              <StudentProfile studentData={studentData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/view-profile"
          element={
            studentData ? (
              <ViewProfile studentData={studentData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/projects"
          element={
            studentData ? (
              <Projects studentData={studentData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/teacher/login"
          element={
            teacherData ? (
              <Navigate to="/teacher/dashboard" />
            ) : (
              <TeacherLogin onLogin={handleTeacherLogin} />
            )
          }
        />
        <Route
          path="/teacher/register"
          element={
            teacherData ? (
              <Navigate to="/teacher/dashboard" />
            ) : (
              <TeacherRegister onRegister={handleTeacherLogin} />
            )
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            teacherData ? (
              <TeacherDashboard teacherData={teacherData} onLogout={handleTeacherLogout} />
            ) : (
              <Navigate to="/teacher/login" />
            )
          }
        />
        <Route
          path="/admin/login"
          element={
            adminData ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          }
        />
        <Route
          path="/admin/register"
          element={
            adminData ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminRegister onRegister={handleAdminLogin} />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            adminData ? (
              <AdminDashboard adminData={adminData} onLogout={handleAdminLogout} />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
