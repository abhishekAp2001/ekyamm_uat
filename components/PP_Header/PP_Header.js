import { ChevronLeft } from "lucide-react";
import React from "react";

const PP_Header = () => {
  return (
    <>
    <div  className="">
      <div className="flex items-center p-4 gap-[9px]">
        <ChevronLeft size={24} className=" text-black-700" />
        <div className="flex-1 text-[16px] font-semibold text-gray-800">
         Patient Details
        </div>
        <div className="h-6 w-6" /> 
      </div>
      </div>
    </>
  );
};

export default PP_Header;
