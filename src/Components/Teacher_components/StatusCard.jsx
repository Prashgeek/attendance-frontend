import React from "react";

const StatusCard = ({ label, count, color, text }) => {
  return (
    <div className={`flex items-center justify-between w-1/3 ${color} p-4 rounded-lg`}>
      <span className={`font-medium ${text}`}>{label}</span>
      <span className={`font-semibold ${text}`}>{count}</span>
    </div>
  );
};

export default StatusCard;
