"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAmount } from "@/lib/utils";
import axios from "axios";
import { showErrorToast } from "@/lib/toast";
import { Baseurl } from "@/lib/constants";
import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
const Profile = ({
  patient,
  setShowCounsellorProfile,
  setShowCertifications,
  setShowClientTestimonials,
  doc,
}) => {
  const router = useRouter()
    const handleBookNowClick = () => {
    setCookie("selectedCounsellor", JSON.stringify(doc));
    if (patient.availableCredits === 0) {
      router.push("/patient/select-package")
    }
    else {
      router.push("/patient/schedule-session");
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] relative max-w-[576px] mx-auto">
          <div className="fixed top-0 left-0 right-0 w-full h-[64px] z-50 flex items-center justify-between px-4 bg-[#eeecfb] max-w-[576px] mx-auto">
        <ChevronLeft
          size={24}
          className="text-black cursor-pointer"
          onClick={() => {
            setShowCounsellorProfile(false);
          }}
        />
        <div className="cursor-pointer"
         onClick={() => {
            setShowCounsellorProfile(false);
          }}>
          <Image src="/images/Chats.png" alt="Chats" width={40} height={43} />
        </div>
      </div>
    {doc ? (
      <>
      <div className="flex-1 pt-[116px] pb-[90px] w-full overflow-auto px-4">
        <div className="w-full mx-auto bg-[#FFFFFFCC] rounded-[12px] px-4 pt-8 pb-6 flex flex-col items-center">
          {/* Profile Image + Name */}
          <div className="flex flex-col items-center -mt-20">
            <Avatar className="w-28 h-28 rounded-full object-fill">
              <AvatarImage
                src={doc?.generalInformation?.profileImageUrl}
                alt={`${doc?.generalInformation?.firstName} ${doc?.generalInformation?.lastName}`}
              />
              <AvatarFallback>
                {`${doc?.generalInformation?.firstName} ${doc?.generalInformation?.lastName}`
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* <Image
              src="/images/img.png.jpg"
              alt="Profile"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-fill"
            /> */}
            <span className="mt-4 text-black text-[20px] font-semibold leading-[1]">
              {`${doc?.generalInformation?.firstName} ${doc?.generalInformation?.lastName}`}
            </span>
            <span className="text-[#6D6A5D] text-[12px] font-medium">
              {doc?.generalInformation?.city}, {doc?.generalInformation?.state}
            </span>
          </div>

          {/* Info Card 1 */}
          <div className="mt-5 w-full py-[10px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">
              Experience:
            </span>
            <p className="text-black text-sm font-normal">
              {doc?.practiceDetails?.yearsOfExperience}+ Years
            </p>
          </div>

          {/* Info Card 2 */}
          <div className="mt-3 w-full py-[10px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">Language:</span>
            <p className="text-black text-sm font-normal">
              {Array.isArray(doc?.practiceDetails?.languageProficiency)
                ? doc?.practiceDetails?.languageProficiency.map((lang, _lx) => (
                    <span
                      key={_lx}
                      className={`${
                        _lx === 0 ? "text-sm text-[#776EA5] font-black" : ""
                      }`}
                    >
                      {lang?.trim() || ""}{" "}
                    </span>
                  ))
                : doc?.practiceDetails?.languageProficiency
                    ?.split(",")
                    ?.map((lang, _lx) => (
                      <span
                        key={_lx}
                        className={`${
                          _lx === 0 ? "text-sm text-[#776EA5] font-black" : ""
                        }`}
                      >
                        {lang?.trim() || ""}{" "}
                      </span>
                    ))}
              {/* <strong className="text-sm text-[#776EA5] font-black">
                Telugu,
              </strong>
              Marathi, Konkani, Tamil, Odia, Spanish, Hindi, English, French */}
            </p>
          </div>

          {/* Info Card 3 */}
          <div className="mt-3 w-full py-[10px] rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">
              Does not treat:
            </span>
            <p className="text-black text-sm font-normal">
              {doc?.practiceDetails?.whatIDontTreat}
            </p>
          </div>

          {/* Info Card 4 */}
          <div className="mt-3 w-full py-[10px]  rounded-[8px] bg-gradient-to-r from-[#eeecfb] to-[#fce8e5] px-4 flex flex-col justify-center">
            <span className="text-black text-sm font-semibold">
              What to expect in the session:
            </span>
            <p className="text-black text-sm font-normal">
              {doc?.practiceDetails?.whatToExpectInSession}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 w-full">
            <Button
              onClick={() => {
                setShowCertifications(true);
              }}
              className="w-full font-semibold rounded-[8px] border border-[#CC627B] text-[#CC627B] bg-white"
            >
              Certifications
            </Button>
            <Button
              onClick={() => {
                setShowClientTestimonials(true);
              }}
              className="w-full font-semibold rounded-[8px] py-3 border border-[#CC627B] text-[#CC627B] bg-white"
            >
              Client Testimonials
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#fce8e5] flex justify-center py-4 max-w-[576px] mx-auto px-6">
        <Button
          onClick={() => {
            handleBookNowClick()
          }}
          className="w-full h-[45px] bg-gradient-to-r from-[#E7A1A0] to-[#BBA3E4] text-white text-[15px] font-semibold rounded-[8px]"
        >
          Book Now at {formatAmount(doc?.practiceDetails?.fees?.singleSession)}/- per session
        </Button>
      </div>
      </>
    ):(
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No assigned therapist</p>
      </div>
    )}
        </div>
  );
};

export default Profile;
