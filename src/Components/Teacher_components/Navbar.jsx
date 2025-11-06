import React from "react";
import { FaClipboardCheck, FaUsers, FaCalendarAlt } from "react-icons/fa";

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "Mark Attendance", icon: <FaClipboardCheck className="text-sm" /> },
    { name: "My Classes", icon: <FaUsers className="text-sm" /> },
    { name: "History", icon: <FaCalendarAlt className="text-sm" /> },
  ];

  return (
    <div className="flex  mx-32 py-9  bg-gray-50">
      <div className="flex items-center gap-6 bg-gray-100 p-1 rounded-full shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 w-50 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.name
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
