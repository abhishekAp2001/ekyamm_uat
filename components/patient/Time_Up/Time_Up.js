// components/TimeUpCard.tsx
"use client";

import Image from "next/image";
import React from "react";

const Time_Up = () => {
  return (
    <div className="flex items-center bg-gradient-to-b from-[#dedaff] to-[#fbc3b8] px-4  pb-6 min-h-screen max-w-[576px] mx-auto">
      {/* Card */}
      <div className="flex flex-col gap-4 w-full">
       <div className="bg-[#FFFFFF80]  rounded-[20px] p-5 w-full text-center">
        <p className="text-[20px] font-semibold text-black mb-6">
          10 mins left for the Session
        </p>

        <div className="flex gap-3 justify-center w-full">
          {/* Extend Button */}
          {/* End Session Button */}
          <button className="cursor-pointer bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[15px] w-[48%] h-[45px] font-medium rounded-[10px] px-4">
            Ok
          </button>
        </div>
      </div>
      <div className="bg-[#FFFFFF80]  rounded-[20px] p-5 w-full text-center">
        <p className="text-[20px] font-semibold text-black mb-6">
          Time Up: 12:00PM
        </p>

        <div className="flex gap-3 justify-center w-full">
          {/* Extend Button */}
          <button className="cursor-pointer border border-[#DD4F6C] text-[#DD4F6C] text-[15px] w-[48%] h-[45px] font-medium rounded-[10px] px-4">
            Extend by 10 mins.
          </button>

          {/* End Session Button */}
          <button className="cursor-pointer bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[15px] w-[48%] h-[45px] font-medium rounded-[10px] px-4">
            End Session
          </button>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-[#5f5f5f] mt-10 flex flex-col justify-center items-center gap-2 fixed bottom-0 left-0 right-0 pb-5 max-w-[576px] mx-auto">
        <div className="flex items-center gap-1 mt-10">
          <span className="text-[10px] font-medium whitespace-nowrap">
            Copyright © 2025
          </span>
          <Image
            src="/images/ekyamm.png"
            alt="Ekyamm Logo"
            width={100}
            height={24}
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-gray-500 font-medium">
            Any technical support
          </span>
          
            <Image
              src="/images/chat_icon.png"
              width={54}
              height={49}
              className="w-[54px]"
              alt="ekyamm"
            />
          
        </div>
      </footer>
    </div>
  );
};

export default Time_Up;
