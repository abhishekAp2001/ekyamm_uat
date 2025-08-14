"use client";
import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff, Funnel, Link2, MapPin, Menu, Phone, Plus } from "lucide-react";
import { Accordion } from "../ui/accordion";
import DoctorCard from "../patient/DoctorCard";
import SessionDrawer from "../SessionDrawer";
import { doctors, pastSessions, upcomingSession } from "@/lib/utils";
import Sidebar from "../Sidebar/Sidebar";
import UpcomingSession from "../UpcomingSession";
import PastSessions from "../PastSessions";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { patientSessionToken as getPatientSessionToken } from "@/lib/utils";
import { showErrorToast } from "@/lib/toast";
import { Baseurl } from "@/lib/constants";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
const Upcoming_Sessions = ({dashboard = false}) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
    const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState(null);
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
    useEffect(() => {
      const token = getPatientSessionToken();
      setPatientSessionToken(token);
    }, []);
    
      useEffect(() => {
        if (!patientSessionToken) return;
          const getPatientSession = async () => {
            try {
              setLoading(true);
              const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient?type=sessions`, {
                headers: {
                  accesstoken: patientSessionToken,
                  "Content-Type": "application/json",
                },
              });
              if (response?.data?.success) {
                setSessions(response?.data?.data);
              }
            } catch (err) {
              console.log("err", err);
              showErrorToast(
                err?.response?.data?.error?.message || "Error fetching patient data"
              );
            } finally {
              setLoading(false);
            }
          };
          getPatientSession();
  }, [patientSessionToken]);
  return (
    <div className="relative h-screen max-w-[576px]  flex flex-col  bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] ">
      {/* Fixed Header */}
      {/* <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-8 bg-[#e7d6ec] max-w-[576px] mx-auto">
        Gradient Header
        <div className="bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] rounded-bl-3xl rounded-br-3xl px-3 py-5 h-[128px]">
          <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-[18px] text-white font-semibold">
                Cloudnine Hospital
              </h1>
              <div className="flex items-center gap-[2px]">
                <div className="bg-[#FFFFFF80] rounded-full w-[12px] h-[12px] flex items-center justify-center">
                  <MapPin className="w-2 h-2 text-[#9f99bebd]" />
                </div>
                <span className="text-xs text-[#FFFFFF80] font-medium">
                  CMS
                </span>
              </div>
            </div>

            {showSidebar && (
              <div className="absolute inset-0 z-50">
                <Sidebar onClose={() => setShowSidebar(false)} />
              </div>
            )}
            <div className="flex justify-between items-center mt-2 relative">
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
                className="w-5 h-5 "
                onClick={() => setShowSidebar(true)}
              />
            </div>
          </div>
        </div>

        Available Session Section
        <div className="bg-[#FFFFFF80] px-3 py-2 border border-[#FFFFFF33] rounded-[10px] mx-3 -mt-5 z-20 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/images/history_2.png"
                width={23}
                height={23}
                className="w-[23px] mix-blend-multiply"
                alt="History"
              />
              <span className="text-2xl font-semibold text-black">04/04</span>
              <span className="max-[376px]:text-[10px] text-xs font-medium text-[#6D6A5D]">
                Available Sessions
              </span>
            </div>
            <div className="rounded-full bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] p-[1px] h-6">
              <Button className="bg-[#f2ecf9] text-[11px] text-black rounded-full h-full flex items-center gap-1 px-2 py-1">
                <Plus className="w-[10px] text-[#776EA5]" />
                Add Package
              </Button>
            </div>
          </div>
        </div>
      </div> */}
      {/* Go back button */}
      {dashboard ? (
        <></>
      ):(
        <div className="flex items-center justify-between p-5">
          {/* Left Icon */}
          <ChevronLeft size={28} className="text-black cursor-pointer" 
          onClick={()=>{router.push("/patient/patient-profile")}}/>
          {/* Right Side Image */}
          <Image
          onClick={()=>{router.push('/patient/dashboard')}}
            src="/images/box.png"
            width={28}
            height={18}
            alt="right-icon"
            className="bg-transparent"
          />
        </div>
      )}
      {/* Scrollable Body */}
      { loading ? (
        <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" /></div>):
        (
          <div className=" flex-1 overflow-y-auto px-3 pb-5">
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
            {sessions?.upcomingSessions && (
              <>
                {/* Always show first two */}
                <UpcomingSession upcomingsessions={showAllUpcoming
                  ? sessions.upcomingSessions
                  : sessions.upcomingSessions.slice(0, 2)} />
              </>
            )}
            {/* Past Sessions */}
            <PastSessions
              sessions={sessions?.pastSessions} />
          </div>
        )}
      
    </div>
  );
};

export default Upcoming_Sessions;