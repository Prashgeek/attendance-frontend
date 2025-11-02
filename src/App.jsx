// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth
import Login from './pages/auth/Login';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Student pages
import StudentLayout from './layout/Student/StudentLayout';
import Overview from './pages/Student/Overview';
import CheckInCheckOut from './pages/Student/CheckInCheckOut';
import QrScan from './pages/Student/QrScan';
import Attendance from './pages/Student/Attendance';

// ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute';

// Temporary placeholder dashboards for teacher/student
const TeacherDashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <h2>Teacher Dashboard</h2>
    <p>Welcome, Teacher! Your dashboard is under development.</p>
  </div>
);

const StudentDashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <h2>Student Dashboard</h2>
    <p>Welcome, Student! Your main dashboard is under development.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
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
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/student">
          {/* Student layout is protected */}
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
