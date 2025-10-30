import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiClock, FiGrid, FiCalendar } from "react-icons/fi";

const navItems = [
  { name: "Overview", to: "overview", Icon: FiHome },
  { name: "Check In/Out", to: "checkin-checkout", Icon: FiClock },
  { name: "QR Scan", to: "qrscan", Icon: FiGrid },
  { name: "My Attendance", to: "attendance", Icon: FiCalendar },
];

const SelectNav = () => {
  return (
    <div className="bg-white p-3 m-5 mt-10 mb-10 flex items-start justify-start">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-gray-50 rounded-4xl p-2 border border-gray-100 shadow-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-5 justify-center sm:justify-start space-x-0 sm:space-x-2 text-sm font-medium py-2 p-2 rounded-4xl transition duration-150 ease-in-out ${
                  isActive
                    ? "bg-white text-gray-800 shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              <item.Icon className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectNav;
