import React from "react";
import { ClipboardCheck } from 'lucide-react';
const Header = () => {
  return (
    <header className="flex justify-between items-center  px-30 py-4  bg-white ">
      {/* Left Section - Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-600 text-white p-2 rounded-xl">
          <i><ClipboardCheck /></i>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Teacher Dashboard</h1>
          <p className="text-sm text-gray-500">Mathematics</p>
        </div>
      </div>

      
    </header>
  );
};

export default Header;
