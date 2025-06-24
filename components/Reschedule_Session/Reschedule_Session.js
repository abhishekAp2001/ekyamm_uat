"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff, MapPin, Menu, Plus } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import RescheduleSession from "../RescheduleSession";
import RePastSessions from "../RePastSessions";
import { reschedulesession, rePastSessions } from "@/lib/utils";

const Reschedule_Session = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16 ||
        (new Date().getHours() === 16 && new Date().getMinutes() === 0)
      ? "Afternoon"
      : "Evening";

  const extraSession = {
    time: "12:00 PM",
    location: "Andheri",
    duration: "00:45 HR",
    mode: "Offline",
    previousSession: "Tuesday, April 2, 2024",
    doctor: {
      name: "Dr. Rahul Rao",
      profilePic: "/images/rahul.png",
    },
  };

  return (
    <div className="relative h-screen max-w-[576px] flex flex-col bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-8 bg-[#e7d6ec] max-w-[576px] mx-auto">
        <div className="bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] rounded-bl-3xl rounded-br-3xl px-3 py-5 h-[128px]">
          <div className="flex flex-col items-center">
            <h1 className="text-[18px] text-white font-semibold">
              Cloudnine Hospital
            </h1>
            <div className="flex items-center gap-[2px]">
              <div className="bg-[#FFFFFF80] rounded-full w-[12px] h-[12px] flex items-center justify-center">
                <MapPin className="w-2 h-2 text-[#9f99bebd]" />
              </div>
              <span className="text-xs text-[#FFFFFF80] font-medium">CMS</span>
            </div>

            {showSidebar && (
              <div className="absolute inset-0 z-50">
                <Sidebar onClose={() => setShowSidebar(false)} />
              </div>
            )}
            <div className="flex justify-between items-center w-full mt-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/user.png"
                  width={34}
                  height={34}
                  className="pt-1.5 mix-blend-multiply"
                  alt="User"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-white">Good {greeting},</span>
                  <strong className="text-lg text-white">Chinten Shah</strong>
                </div>
              </div>
              <Menu
                color="white"
                className="w-5 h-5"
                onClick={() => setShowSidebar(true)}
              />
            </div>
          </div>
        </div>

        {/* Session Info Box */}
        <div className="bg-[#FFFFFF80] px-3 py-2 border border-[#FFFFFF33] rounded-[10px] mx-3 -mt-5 z-20 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/images/history_2.png"
                width={23}
                height={23}
                className="mix-blend-multiply"
                alt="History"
              />
              <span className="text-2xl font-semibold text-black">04/04</span>
              <span className="text-xs font-medium text-[#6D6A5D]">
                Available Sessions
              </span>
            </div>
            <div className="rounded-full bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] p-[1px] h-6">
              <Button className="bg-[#f2ecf9] text-[11px] text-black rounded-full h-full px-2 py-1">
                <Plus className="w-[10px] text-[#776EA5]" />
                Book Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="mt-[192px] flex-1 overflow-y-auto px-3 pb-5">
        {/* Header */}
        <div className="flex justify-between items-center my-2">
          <strong className="text-sm text-black font-semibold">
            Upcoming Sessions
          </strong>
          <Button
            onClick={() => setShowAllUpcoming((prev) => !prev)}
            className="text-sm text-[#776EA5] rounded-full h-6 flex items-center gap-1 bg-transparent shadow-none px-2"
          >
            {showAllUpcoming ? (
              <EyeOff className="w-[13px] text-[#776EA5]" />
            ) : (
              <Eye className="w-[13px] text-[#776EA5]" />
            )}
            {showAllUpcoming ? "Show Less" : "View All"}
          </Button>
        </div>

        {/* Sessions */}
        {/* <RescheduleSession sessions={reschedulesession} /> */}
         {/* Main Accordion */}
        <RescheduleSession sessions={reschedulesession} />

        {/* Conditionally show extra Accordion on View All */}
        {showAllUpcoming && (
          <RescheduleSession sessions={extraSession} showRescheduleButtons />
        )}

        {showAllUpcoming && <RescheduleSession sessions={extraSession} />}
        <RePastSessions sessions={rePastSessions} />

       
      </div>
    </div>
  );
};

export default Reschedule_Session;
