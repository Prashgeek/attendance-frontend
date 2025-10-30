import React from "react";
import { FaClock } from "react-icons/fa";

const PerformanceSummary = () => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-4">
    <h3 className="text-sm font-semibold mb-2">Performance Summary</h3>
    <p className="text-xs text-gray-500 mb-4">
      Your attendance performance analysis
    </p>
    <div className="flex justify-between mb-2 bg-gray-100 rounded p-2">
      <div>
      <p className="text-sm">Overall Attendance Rate</p>
      <p className="text-gray-400 text-xs">Based on 22 total days</p>
      </div>
      <div>
      <p className="text-green-600 font-semibold">81.8%</p>
      <p className="text-gray-400 text-xs">Good standing</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3 mt-3">
      <div className="text-center border rounded-lg p-3">
        <p className="text-xs text-gray-500">Best Month</p>
        <p className="font-semibold">October 2024</p>
        <p className="text-green-500 text-xs">95% attendance</p>
      </div>
      <div className="text-center border rounded-lg p-3">
        <p className="text-xs text-gray-500">Total Working Hours</p>
        <div className="flex justify-center flex-col items-center gap-1">
          <p className="font-semibold">149.7h</p>
          <p className=" text-xs">This Semester</p>
        </div>
      </div>
      <div className="text-center border rounded-lg p-3">
        <p className="text-xs text-gray-500">Consecutive Present</p>
        <p className="font-semibold">12 days</p>
        <p className=" text-blue-900 text-xs">Current streak</p>
      </div>
    </div>
  </div>
);

export default PerformanceSummary;
