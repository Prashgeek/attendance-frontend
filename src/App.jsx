// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// ====================== Auth ======================
import Login from "./pages/auth/Login";

// ====================== Admin Imports ======================
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

// ====================== Student Imports ======================
import StudentLayout from "./layout/Student/StudentLayout";
import Overview from "./pages/Student/Overview";
import CheckInCheckOut from "./pages/Student/CheckInCheckOut";
import QrScan from "./pages/Student/QrScan";
import Attendance from "./pages/Student/Attendance";

// ====================== Teacher Imports ======================
import Header from "./pages/Teacher/Teacher_components/Header";
import Navbar from "./pages/Teacher/Teacher_components/Navbar";
import MarkAttendance from "./pages/Teacher/Teacher_components/MarkAttendance";
import MyClasses from "./pages/Teacher/Teacher_components/MyClasses";
import History from "./pages/Teacher/Teacher_components/History";

// ====================== Protected Route ======================
import ProtectedRoute from "./components/ProtectedRoute";

// ====================== Layout for Teacher ======================
function TeacherLayout() {
  const [activeTab, setActiveTab] = useState("Mark Attendance");

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="px-6 md:px-10 py-8">
        {activeTab === "Mark Attendance" && <MarkAttendance />}
        {activeTab === "My Classes" && <MyClasses />}
        {activeTab === "History" && <History />}
      </div>
    </div>
  );
}

// ====================== Temporary Dashboards ======================
const TeacherDashboard = () => (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <h2>Teacher Dashboard</h2>
    <p>Welcome, Teacher! Your dashboard is under development.</p>
  </div>
);

const StudentDashboard = () => (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <h2>Student Dashboard</h2>
    <p>Welcome, Student! Your main dashboard is under development.</p>
  </div>
);

// ====================== Main App ======================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------- PUBLIC ROUTE ---------------- */}
        <Route path="/" element={<Login />} />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ---------------- TEACHER ROUTES ---------------- */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        />

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/student">
          <Route
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="overview" element={<Overview />} />
            <Route path="checkin-checkout" element={<CheckInCheckOut />} />
            <Route path="qrscan" element={<QrScan />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
        </Route>

        {/* ---------------- FALLBACK ---------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

