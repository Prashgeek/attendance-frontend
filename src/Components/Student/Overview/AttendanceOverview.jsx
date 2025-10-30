import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Oct 24", hours: 6 },
  { day: "Oct 25", hours: 0 },
  { day: "Oct 26", hours: 0 },
  { day: "Oct 27", hours: 8 },
  { day: "Oct 28", hours: 6 },
  { day: "Oct 29", hours: 6 },
  { day: "Oct 30", hours: 6 },
];

const AttendanceOverview = () => {
  return (
    <div className="grid grid-cols-1 m-10 lg:grid-cols-2 gap-4">
      {/* Attendance Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-700 mb-2">
          Attendance Progress
        </h4>
        <p className="text-sm text-gray-500 mb-3">
          Your overall attendance percentage
        </p>

        <div className="mb-4">
          <p className="text-xs text-gray-900 mb-1 font-bold">Current Attendance</p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-gray-800 rounded-full w-[81%]"></div>
          </div>
          <p className="text-right text-xs text-gray-600 mt-1">81.8%</p>
        </div>

        <div className="flex flex-col gap-1 justify-between text-sm">
          <p className="text-green-600">Present: 18 days</p>
          <p className="text-yellow-600">Late: 2 days</p>
          <p className="text-red-600">Absent: 2 days</p>
        </div>
      </div>

      {/* 7-Day Working Hours Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-700 mb-2">7-Day Working Hours</h4>
        <p className="text-sm text-gray-500 mb-3">
          Your daily working hours for the past week
        </p>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceOverview;
