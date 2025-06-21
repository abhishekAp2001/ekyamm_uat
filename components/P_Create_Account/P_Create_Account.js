"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { whatsappUrl } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const P_Create_Account = () => {
  const [current, setCurrent] = useState(0);

  const steps = [
    "Mobile Verification",
    "Create Password",
    "Add Touch ID",
    "Create Profile",
  ];
  const [value, setValue] = React.useState("");
  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col justify-evenly items-center px-[16px]">
        {/* slider */}
        <div className="flex flex-col items-center justify-center w-[294px]">
          <div className="relative flex justify-between w-full max-w-xl items-center">
            {/* Base line */}
            <div className="absolute top-1 left-[39px] right-[39px] h-1 bg-[#9B9B9B] z-0 rounded"></div>

            {/* Progress line */}
            <div
              className="absolute top-1 left-[39px] right-[39px] h-1 bg-green-500 z-10 rounded transition-all duration-500 w-fit"
              style={{
                width: `${(current / (steps.length - 1)) * 80}%`,
              }}
            ></div>

            {/* Steps */}
            {steps.map((label, index) => (
              <div
                key={index}
                className="flex flex-col items-center z-20 w-1/4 cursor-pointer group px-3"
                onClick={() => setCurrent(index)}
              >
                <div
                  className={`w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 
              ${
                index <= current
                  ? "bg-green-500 border-green-500"
                  : "bg-[#9B9B9B] border-gray-400"
              } 
              group-hover:scale-110`}
                ></div>
                <div className="text-[8px] text-center mt-2 text-gray-700 whitespace-nowrap">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-6 px-6  mx-4 text-center w-full">
            <strong className="text-[16px] text-black font-[600] text-center">
              Create Password
            </strong>
            <div className="pt-6">
              <div className="relative">
                 <Input
                type="text"
                placeholder="Enter Registered Mobile Number"
                className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
              />
                <Image
                  src="/images/green_check.png"
                  width={20}
                  height={20}
                  className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                  alt="check"
                />
              </div>
             
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Create password"
                  className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px] my-5"
                />
                <Eye className="w-[14.67px] absolute top-2 right-[14.83px]" />
              </div>
              <div className="relative">
                <Input
                  type={"text"}
                  placeholder="Re-enter password"
                  className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px] "
                />
                {/* <Eye
                    className="w-[14.67px] absolute top-2 right-[14.83px]"
                  /> */}
                <EyeOff className="w-[14.67px] absolute top-2 right-[14.83px]" />
              </div>

              <div className="flex justify-between items-center mt-[24.69px]  gap-3">
                  <Link href={'/patient-registration/psychiatrist-details'} className="w-full">
                <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-full h-[45px]">
                Create
                </Button></Link>
              </div>
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
        </div>

        {/* footer */}
        <div className="">
          <div className="flex flex-col justify-center items-center gap-[4.75px] fixed bottom-0 p-[20px] left-0 right-0">
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
      </div>
    </>
  );
};

export default P_Create_Account;
