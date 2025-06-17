'use client'
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

const Forgot_password = () => {
  const [value, setValue] = React.useState("");
  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col justify-center items-center px-3">
        <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-[47.28px] px-6  mx-4 text-center w-full">
          <strong className="text-[16px] text-black font-[600] text-center">
            Forgot Password?
          </strong>
          <div className="pt-6">
            <Input
              type="text"
              placeholder="Enter Registered Mobile Number"
              className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
            />
            {/* otp */}
            <div className="mt-6">
               <div className="text-[12px] text-gray-500 font-medium text-left mb-1">
                {value === "" ? (
                  <>Enter OTP</>
                ) : (
                  <>You entered: {value}</>
                )}
              </div>
              <InputOTP
             maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup className='flex justify-between items-center w-full'>
                  <InputOTPSlot index={0} className='w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500' />
                  <InputOTPSlot index={1} className='w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500' />
                  <InputOTPSlot index={2} className='w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500' />
                  <InputOTPSlot index={3} className='w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500' />
                  <InputOTPSlot index={4} className='w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500' />
                  <InputOTPSlot index={5} className='w-[42px] h-[42px] border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-gray-500' />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex justify-between items-center mt-[24.69px]  gap-3">
              <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                Already a User?
              </Button>
                  <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                Get OTP
              </Button>
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

export default Forgot_password;
