import React from "react";
import { HiOutlineQrCode } from "react-icons/hi2";
import { LuCamera, LuKeyboard } from "react-icons/lu";

const QRCodeAttendance = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 max-w-3xl mx-auto">
      {/* Title */}
      <h3 className="text-sm font-semibold mb-1">QR Code Attendance</h3>
      <p className="text-xs text-gray-500 mb-4">
        Scan the QR code displayed in your classroom
      </p>

      {/* QR Code Box */}
      <div className="flex flex-col items-center">
        <div className="w-60 p-5 h-60 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm mb-4">
          <HiOutlineQrCode className="text-5xl mb-2 text-gray-400" />
          Click the button below to start scanning
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Start Scanning */}
          <button className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs px-4 py-2 rounded-md transition">
            <LuCamera className="text-sm" />
            Start Scanning
          </button>

          {/* Manual Entry */}
          <button className="flex items-center justify-center gap-2 border border-gray-300 text-xs px-3 py-2 rounded-md hover:bg-gray-50 transition">
            <LuKeyboard className="text-sm" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 text-blue-700 text-xs p-4 rounded-md mt-6 leading-relaxed">
        <p className="font-medium mb-1 flex items-center gap-2">
          <HiOutlineQrCode className="text-base" />
          How to use QR Code Attendance:
        </p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Ask your teacher to display the QR code</li>
          <li>Click “Start Scanning” button</li>
          <li>Point your camera at the QR code</li>
          <li>Wait for automatic detection</li>
          <li>Your attendance will be marked instantly</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeAttendance;
