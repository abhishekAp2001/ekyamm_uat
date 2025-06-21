"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Psychiatrist_profile = () => {
  return (
    <div className="h-screen flex flex-col items-start justify-start bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] relative px-4 overflow-auto max-w-[574px] mx-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center px-4 max-w-[574px] mx-auto">
        <div className="flex justify-between w-full items-center">
        <ChevronLeft size={24} className="text-black cursor-pointer" />
     
          <Image src="/images/chats.png" alt="Chats" width={40} height={43} />
      </div>
      </div>

      {/* Main Card */}
      <div className="pt-[120px]">
      <div className="flex justify-center items-center rounded-[16px] border bg-[#ffffffd1] w-full h-auto">
        <div className="w-full h-auto px-4 py-6 flex flex-col items-center justify-start text-center">
          {/* CH Circle */}
          <div className="relative w-full flex justify-center">
            <div
              className="w-28 h-28 bg-[#8F82C1] rounded-full flex items-center justify-center text-white font-quicksand font-semibold"
              style={{ fontSize: "50px", marginTop: "-76px" }}
            >
              CH
            </div>
          </div>

          {/* Hospital Info */}
          <div className="w-[328px] flex flex-col items-center justify-center mt-2">
            <p className="font-quicksand font-semibold text-[20px] leading-[100%] text-center m-0">
              Cloudnine Hospital
            </p>
            <p className="text-[15px] font-normal text-center m-0 leading-tight opacity-70">
              Pimple Saudagar
            </p>

            {/* Icons + Emergency */}
            <div
              className="flex items-center mt-[10px]"
              style={{ gap: "12px" }}
            >
              <div className="flex items-center gap-[10px]">
                <Image
                  src="/images/Group 924.png"
                  alt="icon1"
                  width={24}
                  height={24}
                />
                <Image
                  src="/images/whatsapp.png"
                  alt="icon2"
                  width={24}
                  height={24}
                />
                <Image
                  src="/images/Group 923.png"
                  alt="icon3"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex items-center bg-[#EC4444] text-white text-[12px] rounded-[5px] px-2 py-1 gap-1">
                <Image
                  src="/images/call.png"
                  alt="Emergency"
                  width={12}
                  height={12}
                />
                <span>Emergency</span>
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="w-full bg-gradient-to-r from-[#bba3e438] to-[#eda1974d] rounded-[8px] p-[10px] mt-4 px-4 text-left">
            <p className="text-[15px] font-semibold">Timing:</p>
            <p className="text-[13px] mt-[2px]">Open 24 hours</p>
          </div>

          {/* Address */}
          <div className="w-full bg-gradient-to-r from-[#bba3e438] to-[#eda1974d] rounded-[8px] p-[10px] mt-3 text-left">
            <p className="text-[15px] font-semibold">Address:</p>
            <p className="text-[13px] mt-[2px] leading-snug">
              Blue Sapphire Business Park, nr. Govind Yashada Chowk,
              Vishwashanti Colony, Pimple Saudagar, Pune, Pimpri-Chinchwad,
              Maharashtra 411027
            </p>
          </div>

          {/* Doctor Info */}
          <div className="w-full h-[56px] flex items-center justify-between bg-gradient-to-r from-[#bba3e438] to-[#eda1974d] rounded-[8px] p-[12px] gap-[10px] mt-3">
            <div className="flex items-center gap-[10px]">
              <Image
                src="/images/medical_services.png"
                alt="Medical Icon"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="text-[15px] font-medium">Dr. Seema Jain</span>
            </div>

            {/* Drawer Trigger */}
            <Drawer>
              <DrawerTrigger>
                <ChevronLeft className="rotate-180 text-[#8F8F8F]" />
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="sr-only text-[15px]">Doctor Details</DrawerTitle>
                  <DrawerDescription className="sr-only text-[17px]">
                    Detailed information about the psychiatrist.
                  </DrawerDescription>
                </DrawerHeader>

                {/* Actual Visible Content */}
                <div className="fixed bottom-0 left-0 right-0 w-full  ">
                  <DrawerClose asChild>
                    <Image
                      src="/images/close.png"
                      alt="Close"
                      width={26}
                      height={24}
                      className="absolute cursor-pointer"
                      style={{ top: "15px", right: "15px" }}
                    />
                  </DrawerClose>

                  <div
                    className="rounded-t-[16px] w-full "
                    style={{ background: "linear-gradient(#DFDAFB, #F9CCC5)" }}
                  >
                    <div className="rounded-t-[14px] p-4 bg-gradient-to-b from-[#eeecfb] to-[#eeecfb] shadow-lg text-center">
                      <div className="flex items-center justify-center gap-2 mb-2 mt-7">
                        <Image
                          src="/images/medical_services.png"
                          alt="icon"
                          width={24}
                          height={24}
                        />
                        <p className="text-[17px] text-black m-0 font-semibold">
                          Doctor Details
                        </p>
                      </div>
                      <h3 className="text-[20px] font-semibold text-black mb-3">
                        Dr. Seema Jain
                      </h3>

                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Image
                          src="/images/Group 924.png"
                          alt="phone"
                          width={24}
                          height={24}
                        />
                        <Image
                          src="/images/whatsapp.png"
                          alt="whatsapp"
                          width={24}
                          height={24}
                        />
                        <Image
                          src="/images/Group 923.png"
                          alt="mail"
                          width={24}
                          height={24}
                        />
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#EC4444] rounded-[6px] text-white text-[14px] font-semibold">
                          <Image
                            src="/images/call.png"
                            alt="call"
                            width={12}
                            height={12}
                          />
                          <span>Emergency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Psychiatrist_profile;
