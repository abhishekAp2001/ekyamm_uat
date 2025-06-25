import { ChevronLeft } from "lucide-react";
import React from "react";
import Image from "next/image";
const SS_Header = () => {
  return (
    <>
      <div className=" bg-[#f6f4fd]">
        <div className="flex items-center justify-between p-4">
          {/* Left Icon */}
          <div className="flex justify-items-start items-center gap-2">
            <ChevronLeft size={28} className="text-black cursor-pointer" />
            <span className="text-[16px] font-[600] text-black">
              Sessions Synopsis
            </span>
          </div>
          {/* Right Side Image */}
          <Image
            src="/images/box.png"
            width={28}
            height={18}
            alt="right-icon"
            className="bg-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default SS_Header;
