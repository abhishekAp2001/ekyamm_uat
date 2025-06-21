import { ChevronLeft } from "lucide-react";
import React from "react";

const Client_Header = () => {
  return (
    <div className="w-full px-4 pt-4">
      <div className="flex items-center gap-[9px]">
        <ChevronLeft size={24} className="text-black-700" />
        <span className="text-[14px] font-semibold text-gray-800">
          Client Testimonials
        </span>
      </div>
    </div>
  );
};

export default Client_Header;
