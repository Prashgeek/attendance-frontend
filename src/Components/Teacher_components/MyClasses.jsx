import React from "react";
import {
  FaUserGroup,
  FaArrowTrendUp,
  FaCircleExclamation,
  FaUserCheck,
} from "react-icons/fa6";

const MyClasses = () => {
  const classes = [
    {
      name: "Class 10-A",
      students: 5,
      avgAttendance: 80.9,
      presentToday: 4,
      lowAttendance: 0,
      topPerformers: [
        { name: "Sarah Johnson", percentage: 77 },
        { name: "Michael Brown", percentage: 77 },
        { name: "Emily Davis", percentage: 82 },
      ],
    },
    {
      name: "Class 10-B",
      students: 3,
      avgAttendance: 80.3,
      presentToday: 2,
      lowAttendance: 1,
      topPerformers: [
        { name: "Robert Taylor", percentage: 73 },
        { name: "Jennifer Martinez", percentage: 91 },
        { name: "James Garcia", percentage: 77 },
      ],
    },
  ];

  return (
    <div className="px-25 bg-gray-50 min-h-screen space-y-8">
      
      <div className="grid md:grid-cols-2 gap-8">
        {classes.map((cls, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm  p-6 hover:shadow-md transition"
          >
            {/* Class Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-gray-800 font-semibold">{cls.name}</h3>
                <p className="text-gray-500 text-sm">
                  {cls.students} students enrolled
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3">
                <FaUserGroup className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Students</p>
                  <p className="font-medium text-gray-800">{cls.students}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                <FaArrowTrendUp className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Avg Attendance</p>
                  <p className="font-medium text-gray-800">
                    {cls.avgAttendance}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-purple-50 rounded-xl p-3">
                <FaUserCheck className="text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Present Today</p>
                  <p className="font-medium text-gray-800">
                    {cls.presentToday}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-red-50 rounded-xl p-3">
                <FaCircleExclamation className="text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Low Attendance</p>
                  <p className="font-medium text-gray-800">
                    {cls.lowAttendance}
                  </p>
                </div>
              </div>
            </div>

            {/* Class Average Attendance */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-2">
                Class Average Attendance
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${cls.avgAttendance}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">
                {cls.avgAttendance}%
              </p>
            </div>

            {/* Top Performers */}
            <div>
              <p className="font-medium text-gray-800 mb-2">Top Performers</p>
              <ul className="space-y-2">
                {cls.topPerformers.map((student, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <span className="text-gray-700">{student.name}</span>
                    <span className="text-green-600 font-medium">
                      {student.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
