import React from "react";
import { FaDownload } from "react-icons/fa";

const HeaderSection = () => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <h2 className="text-sm font-semibold">My Attendance Records</h2>
      <p className="text-xs text-gray-500">
        View and download your attendance history
      </p>
    </div>
    <button className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200">
      <FaDownload /> Download Report
    </button>
  </div>
);

export default HeaderSection;
