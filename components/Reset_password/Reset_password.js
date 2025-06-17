"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { whatsappUrl } from "@/lib/constants";

const Reset_password = () => {
  const [value, setValue] = React.useState("");
  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col justify-center items-center px-3">
        <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl pt-[14.83px] px-5 pb-[32.17px]  mx-4 text-center w-full">
          <strong className="text-[16px] text-black font-[600] text-center">
            Reset Password?
          </strong>
          <div className="pt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter New Password"
                className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
              />
              <Image
                src="/images/visibility.png"
                width={14}
                height={10}
                className="w-[14.67px] absolute top-4 right-[14.83px]"
                alt="ekyamm"
              />
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Re-Enter New Password"
                className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 my-6 pt-3 pb-3.5 px-4 h-[39px]"
              />
              <Image
                src="/images/visibility.png"
                width={14}
                height={10}
                className="w-[14.67px] absolute top-4 right-[14.83px]"
                alt="ekyamm"
              />
            </div>

            <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-full h-[45px]">
              Reset Password
            </Button>
          </div>
        </div>

        <div className="flex gap-1 items-center mt-[54px]">
          <span className="text-[10px] text-gray-500 font-medium">
            Copyright © {new Date().getFullYear()}
          </span>
          <Image
            src="/images/ekyamm.png"
            width={100}
            height={49}
            className="w-[106px] mix-blend-multiply"
            alt="ekyamm"
          />
        </div>

        {/* footer */}
        <div className="flex flex-col justify-center items-center gap-[4.75px] fixed bottom-20 left-0 right-0">
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 font-medium">
              Any technical support
            </span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/chat_icon.png"
                width={54}
                height={49}
                className="w-[54px]"
                alt="ekyamm"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reset_password;
