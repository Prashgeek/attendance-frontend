import React from "react";

const History = () => {
  const students = [
    {
      name: "Sarah Johnson",
      records: ["L", "P", "P", "A", "P", "-", "-", "P", "P", "A"],
      percentage: 77,
    },
    {
      name: "Michael Brown",
      records: ["L", "P", "L", "P", "A", "-", "-", "P", "P", "P"],
      percentage: 77,
    },
    {
      name: "Emily Davis",
      records: ["A", "L", "P", "P", "P", "-", "-", "P", "P", "P"],
      percentage: 82,
    },
    {
      name: "David Wilson",
      records: ["P", "P", "L", "P", "P", "-", "-", "P", "P", "P"],
      percentage: 82,
    },
    {
      name: "Lisa Anderson",
      records: ["P", "P", "P", "P", "P", "-", "-", "P", "P", "P"],
      percentage: 86,
    },
  ];

  const dates = [
    "Oct 20",
    "Oct 21",
    "Oct 22",
    "Oct 23",
    "Oct 24",
    "Oct 25",
    "Oct 26",
    "Oct 27",
    "Oct 28",
    "Oct 29",
  ];

  const getBadgeStyle = (status) => {
    if (status === "P") return "bg-green-500 text-white";
    if (status === "A") return "bg-[#E63946] text-white";
    if (status === "L") return "bg-yellow-200 text-gray-800";
    return "text-gray-400";
  };

  return (
    <div className="bg-white rounded-2xl mx-auto w-[90%] shadow-sm border border-gray-100 p-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Attendance History</h2>
          <p className="text-sm text-gray-500">
            View past attendance records for your classes
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <span className="text-sm text-gray-700 font-medium">Class:</span>
          <select className="border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400">
            <option>Class 10-A</option>
            <option>Class 10-B</option>
          </select>
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-xl">
        <table className="min-w-[1000px] w-full text-sm border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-600">
              <th className="text-left px-4 py-2 font-medium sticky left-0 bg-white z-10">
                Student
              </th>
              {dates.map((d, i) => (
                <th key={i} className="text-center px-2 py-2 font-medium">
                  {d}
                </th>
              ))}
              <th className="text-center px-3 py-2 font-medium">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={idx}
                className="bg-gray-50 hover:bg-gray-100 transition-all duration-150 shadow-sm"
              >
                <td className="px-4 py-3 text-gray-800 font-medium rounded-l-xl sticky left-0 bg-gray-50">
                  {student.name}
                </td>
                {student.records.map((r, i) => (
                  <td key={i} className="px-2 py-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold ${getBadgeStyle(
                        r
                      )}`}
                    >
                      {r}
                    </span>
                  </td>
                ))}
                <td className="px-4 py-3 text-green-600 font-semibold text-center rounded-r-xl">
                  {student.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
