import { ChevronLeft } from "lucide-react";
import React from "react";

const Filter_Header = () => {
  return (
    <>
    <div  className=" bg-[#FFFFFF] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-10">
      <div className="flex items-center p-4 pl-3 gap-[9px]">
        <ChevronLeft size={28} className=" text-black-700" />
        <div className="flex-1 text-[16px] font-[600] text-gray-800">
         Filter
        </div>
        <div className="h-6 w-6" /> {/* Space */}
      </div>
      </div>
    </>
  );
};

export default Filter_Header;
