import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState } from "react";

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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* ====================== Student Routes ====================== */}
          <Route path="student">
            <Route index element={<>Not Found</>} />
            <Route element={<StudentLayout />}>
              <Route path="overview" element={<Overview />} />
              <Route path="checkin-checkout" element={<CheckInCheckOut />} />
              <Route path="qrscan" element={<QrScan />} />
              <Route path="attendance" element={<Attendance />} />
            </Route>
          </Route>

          {/* ====================== Teacher Routes ====================== */}
          <Route path="teacher" element={<TeacherLayout />} />

          {/* ====================== Admin Routes (Future) ====================== */}
          <Route path="*" element={<>404 - Page Not Found</>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
