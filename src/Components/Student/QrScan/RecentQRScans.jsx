import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const RecentQRScans = () => {
  const scans = [
    { date: "Oct 29, 2025", time: "8:54 AM" },
    { date: "Oct 28, 2025", time: "8:13 AM" },
    { date: "Oct 27, 2025", time: "9:47 AM" },
    { date: "Oct 26, 2025", time: "8:42 AM" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 max-w-3xl mx-auto">
      <h3 className="text-base font-semibold mb-1 text-gray-900">
        Recent QR Scans
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Your recent attendance marks via QR code
      </p>

      <div className="space-y-3">
        {scans.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-blue-500 text-xl">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.date}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Scanned</p>
              <p className="text-xs text-gray-500">QR Code</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQRScans;
