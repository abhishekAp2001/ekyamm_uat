"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Funnel,
  Link2,
  MapPin,
  Menu,
  Phone,
  Plus,
} from "lucide-react";
import { doctors, pastSessions, upcomingSession } from "@/lib/utils";
import Sidebar from "../Sidebar/Sidebar";
import UpcomingSession from "../UpcomingSession";
import PastSessions from "../PastSessions";

const Session_Details = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
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

  const greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16 ||
        (new Date().getHours() === 16 && new Date().getMinutes() === 0)
      ? "Afternoon"
      : "Evening";

  return (
    <div className="relative h-screen max-w-[576px]  flex flex-col  bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] max-w-[576px] mx-auto">
      {/* Fixed Header */}
      <div className="flex items-center p-4 gap-[9px] fixed top-0 left-0 right-0 z-10 max-w-[576px] mx-auto bg-[#e2d8f5]">
        <ChevronLeft size={24} className=" text-black-700 cursor-pointer" />
        <div className="flex-1 text-[16px] font-semibold text-gray-800">
          Session Details
        </div>
        <div className="h-6 w-6" /> {/* Space */}
      </div>

      {/* Scrollable Body */}
      <div className="pt-[15%] lg:pt-[8%] flex-1 overflow-y-auto px-3 pb-5">
        {/* Filter Row */}
        <div className="flex justify-between items-center my-2">
          <strong className="text-sm text-black font-semibold">
            Upcoming Sessions
          </strong>
          <Button
            onClick={() => setShowAllUpcoming((prev) => !prev)}
            className="text-sm text-[#776EA5] rounded-full h-6 flex items-center gap-1 bg-transparent shadow-none px-2"
          >
            {showAllUpcoming ? (
              <Eye className="w-[13px] text-[#776EA5] cursor-pointer" />
            ) : (
              <EyeOff className="w-[13px] text-[#776EA5] cursor-pointer" />
            )}
            {showAllUpcoming ? "Show Less" : "View All"}
          </Button>
        </div>

        {/* Upcoming Session */}
        {/* <UpcomingSession sessions={upcomingSession} /> */}
        <UpcomingSession sessions={upcomingSession} />

        {/* Conditionally show extra Accordion on View All */}
        {showAllUpcoming && (
          <UpcomingSession sessions={extraSession} showUpcomingButtons />
        )}
        {showAllUpcoming && <UpcomingSession sessions={extraSession} />}
        {/* Past Sessions */}
        <PastSessions sessions={pastSessions} />
      </div>
    </div>
  );
};

export default Session_Details;
