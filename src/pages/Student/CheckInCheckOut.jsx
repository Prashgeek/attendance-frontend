import React from "react";
import CheckInOutPanel from "../../Components/Student/Checkin/CheckInOutPanel";
import CheckInHistory from "../../Components/Student/Checkin/CheckInHistory";

const CheckInCheckOut = () => {
  return (
    <div className="w-[90%] mx-auto my-6">
      <CheckInOutPanel />
      <CheckInHistory />
    </div>
  );
};

export default CheckInCheckOut;
