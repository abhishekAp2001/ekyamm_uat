"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import Link from "next/link";
import NP_Header from "../NP_Header/NP_Header";
import Image from "next/image";
import Footer_bar from "../Footer_bar/Footer_bar";
import { getCookie, hasCookie } from "cookies-next";
import { MapPin } from "lucide-react";

const NP_Registration = () => {
  const sessions_selection = hasCookie("sessions_selection")
    ? JSON.parse(getCookie("sessions_selection"))
    : null;
  const channelPartnerData = hasCookie("channelPartnerData")
    ? JSON.parse(getCookie("channelPartnerData"))
    : null;
  const invitePatientInfo = hasCookie("invitePatientInfo")
    ? JSON.parse(getCookie("invitePatientInfo"))
    : null;

  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col">
        <NP_Header />
        <div className="h-full flex flex-col justify-between overflow-auto px-[13px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
          <div className="flex flex-col">
            <div className="w-full text-[#776EA5] font-semibold text-[20px] leading-[25px] text-center">
              {channelPartnerData?.clinicName}
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
                <MapPin color="white" className="w-[12.15px] h-[12.15px]" />
              </div>
              <span className="text-sm text-[#776EA5] font-medium">
                {channelPartnerData?.area}
              </span>
            </div>
          </div>
          <div className="bg-[#FFFFFF] rounded-[9px] p-5 relative">
            <strong className=" flex text-[16px] font-[600] text-black items-center justify-center mb-4">
              Package Credit Confirmation
            </strong>
            <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-medium text-[#000000] ml-1">
                Patient Name:
              </span>
              <div className="text-[15px] font-[600] text-black ml-1">
                {invitePatientInfo?.firstName} {invitePatientInfo?.lastName}
              </div>
            </div>
            <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <div className=" flex  justify-between  ">
                <span className="text-[15px] font-[400] text-[#000000] ml-1 pb-2">
                  Number of Sessions:
                </span>
                <span className="text-[15px] font-[600] text-black mr-1">
                  {sessions_selection?.sessionCreditCount}
                </span>
              </div>

              <div className=" flex justify-between ">
                <span className="text-[15px] font-[400] text-[#000000] ml-1">
                  Session Fee (Hourly): {sessions_selection?.sessionCreditCount}
                </span>
                <span className="text-[15px] font-[700] text-black mr-1">
                  <span className="mx-8">₹</span>
                  {sessions_selection?.sessionPrice}
                </span>
              </div>
            </div>
            <div className="flex justify-between mt-2  pt-2 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-[700] text-black ml-1">
                Total:
              </span>
              <span className="text-[15px] font-[700] text-black mr-1">
                <span className="mx-8">₹</span>
                {Number(sessions_selection?.sessionPrice) *
                  Number(sessions_selection?.sessionCreditCount)}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] flex flex-col items-center gap-3  py-[23px] px-[17px] left-0 right-0 max-w-[576px] mx-auto">
            <Footer_bar />
          </div>
        </div>
      </div>
    </>
  );
};

export default NP_Registration;
