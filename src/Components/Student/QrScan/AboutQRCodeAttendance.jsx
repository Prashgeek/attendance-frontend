import React from "react";

const AboutQRCodeAttendance = () => {
  const info = [
    {
      id: 1,
      title: "Fast and Contactless",
      desc: "Mark your attendance in seconds without any physical contact",
    },
    {
      id: 2,
      title: "Secure and Accurate",
      desc: "Each QR code is unique and time-limited for security",
    },
    {
      id: 3,
      title: "Instant Confirmation",
      desc: "Get immediate feedback when your attendance is recorded",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-3xl mx-auto">
      <h3 className="text-base font-semibold mb-4 text-gray-900">
        About QR Code Attendance
      </h3>

      <div className="space-y-4">
        {info.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
              {item.id}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutQRCodeAttendance;
