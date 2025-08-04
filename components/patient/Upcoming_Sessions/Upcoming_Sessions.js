"use client";
import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff, Funnel, Link2, MapPin, Menu, Phone, Plus } from "lucide-react";
import { Accordion } from "../../ui/accordion";
import DoctorCard from "../DoctorCard";
import SessionDrawer from "../SessionDrawer";
import { doctors, getStorage, pastSessions, upcomingSession } from "@/lib/utils";
import Sidebar from "../Sidebar/Sidebar";
import UpcomingSession from "../UpcomingSession";
import PastSessions from "../PastSessions";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { patientSessionToken as getPatientSessionToken } from "@/lib/utils";
import { showErrorToast } from "@/lib/toast";
import { Baseurl } from "@/lib/constants";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useRememberMe } from "@/app/context/RememberMeContext";
const Upcoming_Sessions = ({dashboard = false}) => {
  const {rememberMe} = useRememberMe();
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState(null);
  const [patientSessionToken, setPatientSessionToken] = useState(null);
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
  if (typeof window === "undefined") return; // Only run on client
  // const cookie = getCookie("patientSessionData");
  const cookie = getStorage("patientSessionData", rememberMe);

  try {
    if (cookie && cookie !== "undefined") {
      const parsed = cookie
      if (parsed?.token) setPatientSessionToken(parsed.token);
    }
    else {
      router.push('/patient/login')
    }
  } catch (err) {
    console.error("Parse failed", err);
  }
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
    // <div className="relative max-w-[576px]  flex flex-col  bg-gradient-to-b space-y-4 from-[#e7d6ec] to-[#F9CCC5] ">
    // <div className="relative max-w-[576px] overflow-auto h-full  flex flex-col bg-[linear-gradient(#e2d9f6_0%,_#f9ccc587_100%)]">
    <div className={`relative max-w-[576px] overflow-auto h-full  flex flex-col ${pathname==='/patient/dashboard' ? '' : 'bg-[linear-gradient(#e2d9f6_0%,_#f9ccc587_100%)]'}`}>
     
      {/* Go back button */}
      {dashboard ? (
        <></>
      ):(
       <>
         <div className="flex items-center justify-between py-5 ps-2 pe-5 fixed top-0 left-0 right-0 z-50 bg-[] max-w-[576px] mx-auto">
          {/* Left Icon */}
         <div className="flex items-center text-[16px] font-semibold text-gray-800">
           <ChevronLeft size={28} className="text-black cursor-pointer" 
          onClick={()=>{router.push("/patient/patient-profile")}}/>
          Session Details
         </div>
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
       </>
      )}
      {/* Scrollable Body */}
      { loading ? (
        <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" /></div>):
        (
          <div className={`flex-1 px-4 pb-5 ${pathname==='/patient/dashboard' ? '' : 'pt-[15%] md:pt-[10%]'}`}>
        {/* Filter Row */}
        <div className="flex justify-between items-center my-2 ">
          <strong className="text-sm text-black font-semibold">
            Upcoming Sessions
          </strong>
          <Button
            onClick={() => setShowAllUpcoming((prev) => !prev)}
            className="text-sm text-[#776EA5] rounded-full h-6 flex items-center gap-1 bg-transparent shadow-none px-2"
          >
            {showAllUpcoming ? (
              <Eye className="w-[13px] text-[#776EA5]" />
            ) : (
              <EyeOff className="w-[13px] text-[#776EA5]" />
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
                  : sessions.upcomingSessions.slice(0, 2)}
                  pastSession={sessions?.pastSessions?.[sessions?.pastSessions?.length - 1]}/>
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