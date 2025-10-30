import React from "react";
import HeaderSection from "../../Components/Student/Attendance/HeaderSection ";
import SummaryCards from "../../Components/Student/Attendance/SummaryCards";
import CalendarView from "../../Components/Student/Attendance/CalendarView";
import MonthlyDetails from "../../Components/Student/Attendance/MonthlyDetails";
import PerformanceSummary from "../../Components/Student/Attendance/PerformanceSummary";

const Attendance = () => {
  return (
    <div className="w-[90%] mx-auto mb-10">
      <HeaderSection />
      <SummaryCards />
      <div className="grid grid-cols-2 gap-4">
        <CalendarView />
        <MonthlyDetails />
      </div>
      <PerformanceSummary />
    </div>
  );
};

export default Attendance;
