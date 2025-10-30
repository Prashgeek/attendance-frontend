import React from "react";
import { FiCalendar } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle } from "react-icons/ai";

const StatsCards = () => {
  const stats = [
    { title: "Total Days", value: "22", sub: "Attendance recorded", icon: <FiCalendar />, status: "default" },
    { title: "Present Days", value: "18", sub: "Days you attended", icon: <AiOutlineCheckCircle />, status: "present" },
    { title: "Late Arrivals", value: "2", sub: "Times you were late", icon: <AiOutlineClockCircle />, status: "late" },
    { title: "Absent Days", value: "2", sub: "Days you missed", icon: <AiOutlineCloseCircle />, status: "absent" },
  ];

  return (
    <div className="grid m-10 grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {stats.map((s, i) => {
        let colorClass = "";

        if (s.status === "present") colorClass = "text-green-600";
        else if (s.status === "late") colorClass = "text-yellow-600";
        else if (s.status === "absent") colorClass = "text-red-600";
        else colorClass = "text-gray-800";

        return (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-start"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`${colorClass} text-lg`}>{s.icon}</span>
              <h4 className="font-medium text-gray-800 text-sm">{s.title}</h4>
            </div>
            <p className={`font-semibold text-lg ${colorClass}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
