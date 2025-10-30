import React from "react";

const TodayStatus = () => {
  return (
    <div className="bg-white m-10 border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Today's Status
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Thursday, October 30, 2025
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-sm">Status</p>
          <p className="font-semibold text-indigo-700">Present</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-sm">Check-In</p>
          <p className="font-semibold text-green-700">08:34</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-sm">Check-Out</p>
          <p className="font-semibold text-purple-700">15:36</p>
        </div>
      </div>
    </div>
  );
};

export default TodayStatus;
