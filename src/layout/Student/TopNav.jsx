import React from 'react';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai';

const TopNav = () => {
  return (
    <nav className="px-3 sm:px-6 py-2 sm:py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex justify-between items-center h-12">

        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg flex items-center justify-center">
            <FaRegCalendarCheck className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-semibold">Student Portal</h1>
            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm">Class 10-A</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="text-right">
            <p className="text-xs sm:text-sm md:text-base font-medium">Sarah Johnson</p>
            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm">STD0001</p>
          </div>

          <button
            className="flex items-center px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm md:text-base bg-white text-gray-800 font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            <AiOutlineLogout className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
