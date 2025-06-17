import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const BackNav = ({ title = "", to = "#" }) => {
  return (
    <>
      <div>
        <div className="flex items-center p-4 gap-[9px]">
          <Link href={to}>
            <ChevronLeft size={24} className=" text-black-700" />
          </Link>
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            {title}
          </div>
          <div className="h-6 w-6" />
        </div>
      </div>
    </>
  );
};

export default BackNav;
