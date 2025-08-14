import { ChevronLeft } from "lucide-react";
import React from "react";

const Client_Header = () => {
  return (
    <div className="w-full fixed top left-0 right-0 z-10 max-w-[576px] mx-auto bg-[#f0ecf9]">
      <div className="flex items-center gap-[9px] p-4">
        <ChevronLeft size={24} className="text-black-700 cursor-pointer" />
        <span className="text-[16px] font-semibold text-gray-800">
          Client Testimonials
        </span>
      </div>
    </div>
  );
};

export default Client_Header;
