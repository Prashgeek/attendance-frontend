import React from "react";

const historyData = [
  { date: "Oct 29, 2025", time: "08:15 AM - 04:09 PM", hours: "8h 2m", status: "Present" },
  { date: "Oct 28, 2025", time: "08:21 AM - 03:56 PM", hours: "7h 41m", status: "Present" },
  { date: "Oct 27, 2025", time: "08:10 AM - 05:11 PM", hours: "7h 22m", status: "Present" },
  { date: "Oct 26, 2025", time: "08:14 AM - 05:19 PM", hours: "7h 12m", status: "Present" },
  { date: "Oct 25, 2025", time: "08:45 AM - 05:29 PM", hours: "8h 44m", status: "Present" },
];

const CheckInHistory = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
      <h4 className="font-medium text-gray-700 mb-1">Recent Check-In History</h4>
      <p className="text-sm text-gray-500 mb-4">
        Your check-in records from the past 7 days
      </p>

      <div className="space-y-3">
        {historyData.map((h, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">{h.date}</p>
              <p className="text-xs text-gray-500">{h.time}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 sm:mt-0">
              <span className="text-sm font-semibold text-gray-700">{h.hours}</span>
              <span className="text-green-600 text-sm">{h.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInHistory;
