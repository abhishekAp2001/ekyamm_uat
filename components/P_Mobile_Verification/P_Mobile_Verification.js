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
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import OTPInput from "react-otp-input";

const P_Mobile_Verification = () => {
  const [current, setCurrent] = useState(0);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

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
          <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-[47.28px] px-6  mx-4 text-center w-full">
            <strong className="text-[16px] text-black font-[600] text-center">
              Create Profile
            </strong>
            <div className="pt-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter Registered Mobile Number/Email Address"
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
              {/* otp */}
              <div className="mt-6">
                <div className="text-[12px] text-gray-500 font-medium text-left mb-1">
                  {value === "" ? <>Enter OTP</> : <>You entered: {value}</>}
                </div>
                <div className="relative flex items-center">
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span className="w-2" />}
                    renderInput={(props) => (
                      <input
                        {...props}
                        type={showOtp ? "text" : "password"}
                        className="border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-[#776EA5] text-center focus:outline-none focus:ring-2 focus:ring-[#776EA5] otp-input "
                      />
                    )}
                    containerStyle="flex justify-between gap-[2px] items-center w-[90%]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowOtp(!showOtp)}
                    aria-label={showOtp ? "Hide OTP" : "Show OTP"}
                  >
                    {showOtp ? (
                      <EyeOff
                        width={20}
                        height={20}
                        className="h-4 w-4 text-[#776EA5]"
                      />
                    ) : (
                      <Eye
                        width={20}
                        height={20}
                        className="h-4 w-4 text-[#776EA5]"
                      />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-[24.69px]  gap-3">
                <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                  Already a User?
                </Button>
                <Link href={"/patient-registration/p_create_account"} className="w-[48%] h-[45px]">
                  <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-full h-[45px]">
                    Get OTP
                  </Button>
                </Link>
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

export default P_Mobile_Verification;
