"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const PP_profile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] relative">
      
      {/* Fixed Header */}
     <div className="fixed top-0 left-0 w-full h-[64px] z-50 flex items-center px-4 bg-gradient-to-b from-[#eeecfb] to-[#eeecfb]">
  <ChevronLeft size={24} className="text-black cursor-pointer" />
  <div
            className="fixed cursor-pointer"
            style={{
              top: "4%",
              right: "16px",
              width: "40px",
              height: "43px",
              transform: "translateY(-50%)",
            }}
          >
            <Image src="/images/chats.png" alt="Chats" width={40} height={43} />
          </div>
</div>


      {/* Scrollable Content Area */}
      <div className="flex-1 pt-[69px] pb-[90px] w-full overflow-auto px-4 mt-5">
  <div className="max-w-md mx-auto h-auto bg-white rounded-[12px] px-4 pt-8 pb-6 flex flex-col items-center">

          {/* Profile Image + Name */}
          <div className="flex flex-col items-center -mt-14">
            <Image
              src="/images/img.png.jpg"
              alt="Profile"
              width={72}
              height={72}
              className="w-28 h-28  rounded-full flex items-center justify-center "
            />
            <span className="mt-3 text-black text-[16px] font-semibold">Savio Dias</span>
            <span className="text-[#6B6B6B] text-[12px]">Bandra, Mumbai</span>
          </div>

          {/* Info Cards */}
          {[
            { title: "Experience:", text: "10+ Years", height: 56 },
            {
              title: "Language:",
              text: "Telugu, Marathi, Konkani, Tamil, Odia, Spanish, Hindi, English, French",
              height: 74,
            },
            {
              title: "Does not treat:",
              text: "Gambling, Drug Addiction",
              height: 56,
            },
            {
              title: "Want to expect in the session:",
              text: "Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjuda",
              height: 128,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="mt-4 px-4 flex flex-col justify-center"
              style={{
                width: "326px",
                height: item.height,
                borderRadius: "8px",
                background: "linear-gradient(to right, #eeecfb, #fce8e5)",
              }}
            >
              <span className="text-black text-[14px] font-semibold">{item.title}</span>
              <p className="text-black text-[12px] mt-1 leading-[14px]">{item.text}</p>
            </div>
          ))}

          {/* Secondary Buttons */}
          <div className="mt-4 flex flex-col gap-4" style={{ width: "326px" }}>
            <Button
              className="w-full font-semibold rounded-[8px] py-2"
              style={{
                backgroundColor: "white",
                border: "2px solid #CC627B",
                color: "#CC627B",
              }}
            >
              Certifications
            </Button>
            <Button
              className="w-full font-semibold rounded-[8px] py-2"
              style={{
                backgroundColor: "white",
                border: "2px solid #CC627B",
                color: "#CC627B",
              }}
            >
              Client Testimonials
            </Button>
          </div>
        </div>
      </div>

     
      {/* Fixed Bottom Button */}
<div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] fixed bottom-0 left-0 right-0 flex justify-center py-4">
  <Button className="w-[350px] h-[45px] bg-gradient-to-r from-[#E7A1A0] to-[#BBA3E4] text-white text-[14px] font-[600] rounded-[8px]">
    Book Now at ₹1,500/- per session
  </Button>
</div>


    </div>
  );
};

export default PP_profile;
