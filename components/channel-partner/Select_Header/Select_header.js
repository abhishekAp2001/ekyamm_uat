import { ChevronLeft } from "lucide-react";
import React from "react";

const Select_Header = () => {
  return (
    <>
      <div className="flex items-center p-4 gap-[9px]">
        <ChevronLeft size={24} className=" text-black-700" />
        <div className="flex-1 text-[16px] font-semibold text-gray-800">
          Select Package
        </div>
        <div className="h-6 w-6" /> {/* Space */}
      </div>
    </>
  );
};

export default Select_Header;
