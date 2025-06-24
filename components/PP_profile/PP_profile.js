"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const PP_profile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] relative max-w-[576px] mx-auto">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 w-full h-[64px] z-50 flex items-center justify-between px-4 bg-[#eeecfb] max-w-[576px] mx-auto">
        <ChevronLeft size={24} className="text-black cursor-pointer" />
        <div className="cursor-pointer">
          <Image src="/images/chats.png" alt="Chats" width={40} height={43} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 pt-[116px] pb-[90px] w-full overflow-auto px-4">
        <div className="w-full mx-auto bg-[#FFFFFFCC] rounded-[12px] px-4 pt-8 pb-6 flex flex-col items-center">
          {/* Profile Image + Name */}
          <div className="flex flex-col items-center -mt-20">
            <Image
              src="/images/img.png.jpg"
              alt="Profile"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-fill"
            />
            <span className="mt-4 text-black text-[20px] font-semibold leading-[1]">Savio Dias</span>
            <span className="text-[#6D6A5D] text-[12px] font-medium">Bandra, Mumbai</span>
          </div>

          {/* Info Card 1 */}
          <div className="mt-5 w-full h-[56px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">Experience:</span>
            <p className="text-black text-sm font-normal">10+ Years</p>
          </div>

          {/* Info Card 2 */}
          <div className="mt-3 w-full h-[74px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">Language:</span>
            <p className="text-black text-sm font-normal">
              <strong className="text-sm text-[#776EA5] font-black">Telugu,</strong>
               Marathi, Konkani, Tamil, Odia, Spanish, Hindi, English, French
            </p>
          </div>

          {/* Info Card 3 */}
          <div className="mt-3 w-full h-[56px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">Does not treat:</span>
            <p className="text-black text-sm font-normal">Gambling, Drug Addiction</p>
          </div>

          {/* Info Card 4 */}
          <div className="mt-3 w-full h-[128px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">Want to expect in the session:</span>
            <p className="text-black text-sm font-normal">
              Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjuda
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 w-full">
            <Button className="w-full font-semibold rounded-[8px] border border-[#CC627B] text-[#CC627B] bg-white">
              Certifications
            </Button>
            <Button className="w-full font-semibold rounded-[8px] py-3 border border-[#CC627B] text-[#CC627B] bg-white">
              Client Testimonials
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#fce8e5] flex justify-center py-4 max-w-[576px] mx-auto px-6">
        <Button className="w-full h-[45px] bg-gradient-to-r from-[#E7A1A0] to-[#BBA3E4] text-white text-[15px] font-semibold rounded-[8px]">
          Book Now at ₹1,500/- per session
        </Button>
      </div>
    </div>
  );
};

export default PP_profile;
