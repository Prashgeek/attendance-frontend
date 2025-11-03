import React, { useState } from "react";
import { CircleCheck} from 'lucide-react';
import { Clock } from 'lucide-react';
import { CircleX } from 'lucide-react';

import {
  FaQrcode,
  FaRegFloppyDisk,
  FaCircleXmark,
  FaClock,
  FaRegCircle,
} from "react-icons/fa6";
import StatusCard from "./StatusCard";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct import

const MarkAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("Class 10-A");
  const [showQR, setShowQR] = useState(false);

  // ✅ Track attendance dynamically
  const [students, setStudents] = useState([
    { id: "STD001", name: "Sarah Johnson", email: "sarah.j@student.com", status: "Not Marked" },
    { id: "STD002", name: "Michael Brown", email: "michael.b@student.com", status: "Not Marked" },
    { id: "STD003", name: "Emily Davis", email: "emily.d@student.com", status: "Not Marked" },
    { id: "STD004", name: "David Wilson", email: "david.w@student.com", status: "Not Marked" },
    { id: "STD005", name: "Lisa Anderson", email: "lisa.a@student.com", status: "Not Marked" },
  ]);

  // ✅ Update attendance per student
  const markAttendance = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  // ✅ Count status summary
  const statusCount = (type) =>
    students.filter((s) => s.status === type).length;

  const handleSave = () => {
    alert("✅ Attendance saved successfully!");
  };

  return (
    <div className=" mx-28 my-[-55] py-4 w-[85%] bg-gray-50 min-h-screen space-y-8">
      {/* Mark Attendance Card */}
      <div className="bg-white rounded-2xl shadow-sm  p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-gray-800 font-semibold text-lg">Mark Attendance</h2>
            <p className="text-gray-500 text-sm">Thursday, October 30, 2025</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              <FaQrcode /> Generate QR Code
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
            >
              <FaRegFloppyDisk /> Save Attendance
            </button>
          </div>
        </div>

        {/* Select Class */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 font-medium mr-3">Select Class:</label>
          <select
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>Class 10-A</option>
            <option>Class 10-B</option>
            <option>Class 9-A</option>
          </select>
        </div>

        {/* Status Summary */}
        <div className="flex gap-4">
          <StatusCard label="Present" count={statusCount("Present")} color="bg-green-50" text="text-green-700" />
          <StatusCard label="Late" count={statusCount("Late")} color="bg-yellow-50" text="text-yellow-700" />
          <StatusCard label="Absent" count={statusCount("Absent")} color="bg-red-50" text="text-red-700" />
        </div>
      </div>

      
     {/* Students Section */}
{/* Students Section */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  <h3 className="font-semibold text-gray-800 mb-1">
    Students ({students.length})
  </h3>
  <p className="text-gray-500 text-sm mb-5">
    Mark attendance for each student
  </p>

  <div className="overflow-hidden rounded-xl border border-gray-200">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-black border-b">
        <tr>
          <th className="py-3 px-5 font-medium">Student ID</th>
          <th className="py-3 px-5 font-medium">Name</th>
          <th className="py-3 px-5 font-medium">Email</th>
          <th className="py-3 px-5 font-medium">Status</th>
          <th className="py-3 px-5 text-center font-medium">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {students.map((student, index) => (
          <tr
            key={student.id}
            className="hover:bg-gray-50 transition-all duration-200"
          >
            <td className="py-3 px-5 text-black font-normal ">{student.id}</td>
            <td className="py-3 px-5 text-black font-normal ">{student.name}</td>
            <td className="py-3 px-5 text-black font-normal">{student.email}</td>
            <td className="py-3 px-5">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  student.status === "Present"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : student.status === "Late"
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                    : student.status === "Absent"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : "bg-gray-50 text-gray-500 border border-gray-100"
                }`}
              >
                {student.status}
              </span>
            </td>
            <td className="py-3 px-5 text-center">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => markAttendance(student.id, "Present")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-black hover:text-white transition"
                  title="Mark Present"
                >
                  <CircleCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => markAttendance(student.id, "Late")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                  title="Mark Late"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={() => markAttendance(student.id, "Absent")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-red-500 hover:text-white transition"
                  title="Mark Absent"
                >
                  <CircleX className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Class QR Code</h2>
            <QRCodeCanvas
              value={`Attendance-${selectedClass}-${Date.now()}`}
              size={180}
            />
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
