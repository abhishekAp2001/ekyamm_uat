'use client'
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Header = ({title}) => {
    const router=useRouter()
  return (
    <div className="flex items-center gap-1 p-4 bg-[#faf7f7] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-10">
      <ChevronLeft onClick={()=>{
        router.push("/")
      }} size={28}  className=" text-black-700" />
      <div className="flex-1 text-[16px] font-semibold text-gray-800">
        {title}
      </div>
      <div className="h-6 w-6" />
    </div>
  );
};

export default Header;
