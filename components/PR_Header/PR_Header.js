import { ChevronLeft } from "lucide-react";
import React from "react";

const PR_Header = () => {
  return (
    <>
    <div  className="">
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
