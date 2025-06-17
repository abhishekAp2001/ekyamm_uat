"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Patient_Header from "../Patient_Header/Patient_Header";
import Link from "next/link";
import { whatsappUrl } from "@/lib/constants";

const OTP_Verify = ({ type }) => {
  const [value, setValue] = React.useState("");
  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col px-3">
        <Patient_Header />
        <div className="h-full flex flex-col justify-around items-center">
          <div className="flex flex-col items-center w-full">
            <strong className="text-[20px] text-[#776EA5] font-semibold">
              Cloudnine Hospital
            </strong>
            <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-[17px] text-center w-full my-[64px]  px-5">
              <strong className="text-[16px] text-black font-[600] text-center">
                Send OTP to
              </strong>
              <div className="">
                <div className="flex justify-between items-center mt-[15px]  gap-3">
                  <Button className="border border-[#1DA563] bg-[#1DA563] text-[14px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                    Email
                  </Button>
                  <Button className="bg-transparent border border-[#CC627B] text-[14px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                    Mobile
                  </Button>
                </div>
                {/* otp */}
                <div className="my-[15px]">
                  <div className="text-[12px] text-gray-500 font-medium text-left mb-1 relative ">
                    {value === "" ? <>Enter OTP</> : <>You entered: {value}</>}
                  </div>
                  <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={(value) => setValue(value)}
                  >
                    <InputOTPGroup className="flex justify-between gap-2 items-center w-[90%]">
                      <InputOTPSlot
                        index={0}
                        className="w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500"
                      />
                    </InputOTPGroup>
                    <Image
                      src="/images/visibility.png"
                      width={14}
                      height={10}
                      className="w-[14.67px] absolute top-4 right-0"
                      alt="ekyamm"
                    />
                  </InputOTP>
                </div>
                <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white  border  py-[14.5px]  rounded-[8px] flex items-center justify-center w-full h-[45px]">
                  <Link
                    href={`/channel-partner/${type}/patient-registration`}
                    className="text-[12px] text-white"
                  >
                    Verify
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-col justify-center items-center gap-[4.75px] pb-5">
          <div className="flex gap-1 items-center">
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

export default OTP_Verify;
