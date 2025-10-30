import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Calendar View</h3>
      <p className="text-xs text-gray-500 mb-3">Click on a date to see details</p>
      <Calendar
        onChange={setValue}
        value={value}
        className="border-none shadow-none"
      />
      <div className="flex gap-3 text-xs mt-3">
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-200 rounded-sm"></div>Present</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-200 rounded-sm"></div>Late</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-200 rounded-sm"></div>Absent</span>
      </div>
    </div>
  );
};

export default CalendarView;
