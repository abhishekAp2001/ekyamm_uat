import { ChevronLeft } from "lucide-react";
import React from "react";

const PR_Header = () => {
  return (
    <>
    <div  className="bg-gradient-to-t from-[#eeecfb] to-[#eeecfb] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-50">
      <div className="flex items-center p-4 gap-[9px]">
        <ChevronLeft size={24} className=" text-black-700" />
        <div className="flex-1 text-[16px] font-semibold text-gray-800">
          New Patient Registration
        </div>
        <div className="h-6 w-6" /> {/* Space */}
      </div>
      </div>
    </>
  );
};

export default PR_Header;
