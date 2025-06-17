import { ChevronLeft } from "lucide-react";
import React from "react";

const  Confirm_Header = () => {
  return (
    <>
    <div  className="">
      <div className="flex items-center p-4 pl-3 gap-[9px]">
        <ChevronLeft size={24} className=" text-black-700" />
        <div className="flex-1 text-[14px] font-[600] text-gray-800">
          Payment Confirmation
        </div>
        <div className="h-6 w-6" /> {/* Space */}
      </div>
      </div>
    </>
  );
};

export default Confirm_Header;
