import React from "react";

const cards = [
  { label: "Total Days", value: 22, color: "text-gray-700" },
  { label: "Present", value: 18, color: "text-green-600" },
  { label: "Late", value: 2, color: "text-yellow-500" },
  { label: "Absent", value: 2, color: "text-red-600" },
];

const SummaryCards = () => (
  <div className="grid grid-cols-4 gap-3 mb-4">
    {cards.map((c, i) => (
      <div
        key={i}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center"
      >
        <p className="text-sm text-gray-600">{c.label}</p>
        <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
      </div>
    ))}
  </div>
);

export default SummaryCards;
