import React from "react";

const MonthlyDetails = () => {
  const data = [
    { date: "Oct 30, 2025", status: "present", in: "08:34", out: "15:36" },
    { date: "Oct 29, 2025", status: "present", in: "08:40", out: "15:30" },
    { date: "Oct 28, 2025", status: "present", in: "08:35", out: "15:25" },
    { date: "Oct 27, 2025", status: "absent", in: "-", out: "-" },
    { date: "Oct 26, 2025", status: "present", in: "08:45", out: "15:40" },
    { date: "Oct 25, 2025", status: "absent", in: "-", out: "-" },
    { date: "Oct 24, 2025", status: "present", in: "08:50", out: "15:45" },
    { date: "Oct 23, 2025", status: "present", in: "08:30", out: "15:20" },
    { date: "Oct 22, 2025", status: "present", in: "08:25", out: "15:30" },
    { date: "Oct 21, 2025", status: "absent", in: "-", out: "-" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm overflow-y-auto max-h-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Monthly Details</h3>
          <p className="text-xs text-gray-500">Attendance rate: 81.8%</p>
        </div>
        <button className="text-xs bg-gray-100 px-2 py-1 rounded-md">October</button>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Check-In</th>
            <th>Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2">{item.date}</td>
              <td>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    item.status === "present"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-2 text-gray-700">{item.in}</td>
              <td className="py-2 text-gray-700">{item.out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyDetails;
