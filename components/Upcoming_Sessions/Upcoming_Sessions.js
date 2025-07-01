"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff, Funnel, Link2, MapPin, Menu, Phone, Plus } from "lucide-react";
import { Accordion } from "../ui/accordion";
import DoctorCard from "../DoctorCard";
import SessionDrawer from "../SessionDrawer";
import { doctors, pastSessions, upcomingSession } from "@/lib/utils";
import Sidebar from "../Sidebar/Sidebar";
import UpcomingSession from "../UpcomingSession";
import PastSessions from "../PastSessions";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCookie } from "cookies-next";
import Header from '../Patient_Dashboard/Header'
import AvailableSession from "../Patient_Dashboard/AvailableSession";
const Upcoming_Sessions = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const patient = JSON.parse(getCookie("PatientInfo"));
  console.log("Patient Info:", patient);
  const greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16 ||
        (new Date().getHours() === 16 && new Date().getMinutes() === 0)
      ? "Afternoon"
      : "Evening";

  return (
    <div className="relative h-screen max-w-[576px]  flex flex-col  bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] ">
      {/* Fixed Header */}
      {/* <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-8 bg-[#e7d6ec] max-w-[576px] mx-auto">
        Gradient Header
        <Header
          patient={patient}
          loading={loading}
        />

        Available Session Section
        <AvailableSession
          patient={patient}
          loading={loading}
        />
      </div> */}

      {/* Scrollable Body */}
      <div className="mt-[192px] flex-1 overflow-y-auto px-3 pb-5">
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
              <EyeOff className="w-[13px] text-[#776EA5]" />
            ) : (
              <Eye className="w-[13px] text-[#776EA5]" />
            )}
            {showAllUpcoming ? "Show Less" : "View All"}
          </Button>
        </div>

        {/* Upcoming Session */}
        <UpcomingSession sessions={upcomingSession} />
        {showAllUpcoming && <UpcomingSession sessions={extraSession} />}
        {/* Past Sessions */}
        <PastSessions sessions={pastSessions} />
      </div>
    </div>
  );
};

export default Upcoming_Sessions;
