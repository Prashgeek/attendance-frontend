import React from "react";
import {
  FiClock,
  FiLogIn,
  FiLogOut,
  FiInfo,
  FiWatch,
} from "react-icons/fi";

const CheckInOutPanel = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-1">
        Check-In / Check-Out
      </h3>
      <p className="text-xs text-gray-400 mb-4">Thursday, October 30, 2025</p>

      {/* Status Box */}
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 mb-4">
        <FiClock className="text-4xl text-gray-400 mx-auto mb-2" />
        <p className="text-gray-700 font-medium">Not checked in yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Click the button below to check in
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg shadow">
          <FiLogIn /> Check In
        </button>
        <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 px-6 py-2 rounded-lg">
          <FiLogOut /> Check Out
        </button>
      </div>

      {/* Status Cards with Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Check-In Time */}
        <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
          <div className="bg-green-50 p-2 rounded-lg">
            <FiLogIn className="text-green-600 text-lg" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Check-In Time</p>
            <p className="text-gray-700 text-sm font-semibold">--:--</p>
          </div>
        </div>

        {/* Check-Out Time */}
        <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-lg">
            <FiLogOut className="text-red-600 text-lg" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Check-Out Time</p>
            <p className="text-gray-700 text-sm font-semibold">--:--</p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
          <div className="bg-yellow-50 p-2 rounded-lg">
            <FiWatch className="text-yellow-600 text-lg" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Working Hours</p>
            <p className="text-gray-700 text-sm font-semibold">--:--</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium mb-2 flex items-center gap-2 text-blue-600">
          <FiInfo /> Important Instructions:
        </p>
        <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm">
          <li>Check in when you arrive at the premises</li>
          <li>Check out before leaving for the day</li>
          <li>Your location may be recorded for verification</li>
          <li>Late check-ins (after 9:00 AM) will be marked as “Late”</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckInOutPanel;
