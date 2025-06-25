import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";

const Date_Slider = ({ selectedDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const goToPreviousDate = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const goToNextDate = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  return (
    <div className="flex items-center justify-center px-6">
      <button
        onClick={goToPreviousDate}
        className=" text-[20px] text-[#00000066] font-[300]"
      >
        ❮
      </button>

      <div className="flex items-center gap-1 text-center text-sm mx-[10px]">
        <span className="text-[#776EA5] font-bold text-[15px]">
          {format(currentDate, "EEE,")}
        </span>
        <span className="text-[#776EA5] text-[15px] font-bold">
          {format(currentDate, "dd MMM yyyy")}
        </span>
      </div>

      <button
        onClick={goToNextDate}
        className="text-[20px] text-[#00000066] font-[300]"
      >
        ❯
      </button>
    </div>
  );
};

export default Date_Slider;
