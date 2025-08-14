import { ChevronLeft } from "lucide-react";
import React from "react";

const Pay_Header = () => {
  return (
    <>
    <div  className="">
      <div className="flex items-center p-3 pl-3 gap-[9px]">
        <ChevronLeft size={24} className=" text-black-700 cursor-pointer" />
        <div className="flex-1 text-[16px] font-semibold text-gray-800">
          Payment
        </div>
        <div className="h-6 w-6" /> {/* Space */}
      </div>
      </div>
    </>
  );
};

export default Pay_Header;
