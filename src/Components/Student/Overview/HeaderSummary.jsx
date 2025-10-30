import React from "react";

const HeaderSummary = () => {
  return (
    <div className="bg-green-50 m-10 border border-green-200 rounded-xl p-4 sm:p-6 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, Sarah! 👋
          </h2>
          <p className="text-sm text-gray-600">
            Here's your attendance overview
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-0">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Attendance Rate</p>
            <p className="text-green-600 font-semibold">81.8%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Days</p>
            <p className="font-semibold">22</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Working Hours</p>
            <p className="font-semibold">149.7h</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-green-600 font-semibold">Good</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSummary;
