"use client";
import Script from "next/script";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Link2, Phone, Share2, Trash } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axios from "axios";
import { patientSessionToken as getPatientSessionToken } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import Profile from "./practitioner/Profile";
import Certifications from "./Certifications/Certifications";
import Client_Testimonial from "./Client_Testimonials/Client_Testimonial";
import Daily from "@daily-co/daily-js";
import { useRememberMe } from "@/app/context/RememberMeContext";
const UpcomingSession = ({ showUpcomingButtons = true, upcomingsessions,pastSession }) => {
  const {rememberMe} = useRememberMe()
  const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [patient, setPatient] = useState(null);
  const [showCounsellorProfile, setShowCounsellorProfile] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showClientTestimonials, setShowClientTestimonials] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const router = useRouter();
  const [therapist, setTherapist] = useState();
  useEffect(() => {
    const cookie = getCookie("PatientInfo");
    if (cookie) {
      try {
        setPatient(JSON.parse(cookie));
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    } else if (!cookie) {
      router.push("/patient/login");
    }
  }, []);
  function convertUTCtoIST(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const istTime = new Date(utcDate.getTime());
    const day = istTime.getDate();
    const month = istTime.toLocaleString("en-US", { month: "long" });
    const dateStr = `${day} ${month}`;
    let hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const timeStr = `${hours}:${minutesStr} ${ampm}`;
    return { date: dateStr, time: timeStr };
  }
  function getTimeDifference(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffMs = toDate - fromDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
  }
  useEffect(() => {
    const token = getPatientSessionToken();
    setPatientSessionToken(token);
  }, []);
  useEffect(() => {
    if (!patientSessionToken) return;
    const getTherapistDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient?type=therapist`,
          {
            headers: {
              accesstoken: patientSessionToken,
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data?.success) {
          let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
          setTherapist(response?.data?.data?.practitionerTagged[0]);
          setCookie(
            "selectedCounsellor",
            JSON.stringify(response?.data?.data?.practitionerTagged[0]),
            maxAge
          );
        }
      } catch (err) {
        console.log("err", err);
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      } finally {
      }
    };
    getTherapistDetails();
  }, [patientSessionToken]);
  const handleBookNowClick = () => {
    let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
    setCookie("selectedCounsellor", JSON.stringify(therapist),maxAge);
    if (patient.availableCredits === 0) {
      router.push("/patient/select-package");
    } else {
      router.push("/patient/schedule-session");
    }
  };

  const loadQuicksandFont = () => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };

  
 
  const handleStartCall = async (sessionId, roomName) => {
    loadQuicksandFont();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/session/verify`, {
        "sessionId": sessionId
      },
        {
          headers: {
            accesstoken: patientSessionToken,
          },
        })
      if (response?.data?.success) {
        showSuccessToast(response?.data?.data?.message)
        const call = Daily.createFrame({
          showLeaveButton: true,
          iframeStyle: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: 0,
    zIndex: 9999,
    background: '#000',
          },
        });
 
        call.setTheme({
          light: {
            colors: {
              accent: "#bba3e4",
              accentText: "#ffffff",
              background: "#ECD3E0",
            },
            fonts: {
              default: '"Quicksand", sans-serif',
            }        
          },
          dark: {
            colors: {
              accent: "#776EA5",
              background: "#ECD3E0",
            },
          },
        });
        call.join({
          url: `${process.env.NEXT_PUBLIC_VIDEO_CALL_URL}/${roomName}`,
          token: response?.data?.data?.token,
        });
        call.on('left-meeting', () => {
          call.destroy();
          router.push('/patient/dashboard')
});
      }
    } catch (error) {
      console.error("error", error)
      const errorMessage = error?.response?.data?.error?.message || "Something went wrong";
      showErrorToast(errorMessage);
 
    }
  }
 

  const isWithinTwoMinutesBefore = (fromTime) => {
    if (!fromTime) return false;
    const fromDate = new Date(fromTime);
    const now = new Date();

    const diffInMs = fromDate - now; // how much time until 'from'
    const diffInMinutes = diffInMs / (1000 * 60); // convert ms to min

    return diffInMinutes <= 2;
  };
  function formatPrettyDate(isoDate) {
    if (!isoDate) return "--";
    const date = new Date(isoDate);

    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    const formatted = date.toLocaleDateString("en-US", options);

    const parts = formatted.split(", ");
    return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }
  function formatSessionTime(sessionTime) {
    const fromDate = new Date(sessionTime.from);
    const toDate = new Date(sessionTime.to);

    const formatOptions = { hour: "numeric", minute: "2-digit", hour12: true };

    const fromTime = fromDate
      .toLocaleTimeString("en-US", formatOptions)
      .toLowerCase();
    const toTime = toDate
      .toLocaleTimeString("en-US", formatOptions)
      .toLowerCase();

    return `${fromTime} – ${toTime}`;
  }

  return (
    <>
      <div>
        {upcomingsessions && upcomingsessions?.length > 0 ? (
          upcomingsessions?.map((session, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                className="bg-[#FFFFFF80] rounded-2xl p-4 w-full mx-auto transition-all duration-300 mb-2"
                key={index}
              >
                {/* COLLAPSED HEADER */}
                {!isExpanded && (
                  <div
                    className="flex flex-col cursor-pointer"
                    onClick={() => setExpandedIndex(index)}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-2 md:gap-3">
                        <div className="flex flex-col w-[120px] md:w-fit">
                          <div className="text-[16px] font-bold text-gray-800 flex flex-col">
                            <div className="text-xs text-[#6D6A5D] font-medium">
                              {convertUTCtoIST(session?.sessionTime?.from).date}
                            </div>
                            <div className="text-base text-black font-bold">
                              {convertUTCtoIST(session?.sessionTime?.from).time}
                            </div>
                          </div>
                          <div className="text-xs text-[#6D6A5D] font-medium">
                            <div className="text-xs text-[#6D6A5D] font-medium">
                              {patient?.addressDetails?.area}
                            </div>
                          </div>
                        </div>
                        <div className="border-gray-300 border w-[1px] h-[56px] mx-0 md:mx-3"></div>
                        <div className="flex gap-2">
                          <Avatar
                            className="w-[42px] h-[42px] border border-[#F6FBF7]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCounsellorProfile(true);
                            }}
                          >
                            <AvatarImage className=""
                              src={
                                patient?.practitionerTagged[0]
                                  ?.generalInformation?.profileImageUrl
                              }
                              alt={
                                patient?.practitionerTagged[0]
                                  ?.generalInformation?.profileImageUrl
                              }
                            />
                            <AvatarFallback>
                              {patient?.practitionerTagged[0]?.generalInformation?.firstName
                                .charAt(0)
                                .toUpperCase() +
                                patient?.practitionerTagged[0]?.generalInformation?.lastName
                                  .charAt(0)
                                  .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col md:gap-2">
                            <div className="text-[14px] font-bold text-gray-800">
                              Dr.{" "}
                              {
                                patient?.practitionerTagged[0]
                                  ?.generalInformation?.firstName
                              }{" "}
                              {
                                patient?.practitionerTagged[0]
                                  ?.generalInformation?.lastName
                              }
                            </div>
                            <Phone
                              size={22}
                              className="bg-[#776EA5] fill-white text-white rounded-full p-[4px] hidden"
                            />
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex flex-col my-2">
                      <p className="text-[#6D6A5D] text-xs font-medium">
                        <span className="font-medium">Session Duration:</span>{" "}
                        {getTimeDifference(
                          session?.sessionTime?.from,
                          session?.sessionTime?.to
                        )}{" "}
                        hours
                      </p>
                      <div className="flex items-center">
                        <p className="text-[#6D6A5D] text-xs font-medium">
                          <span className="font-medium">Session Mode:</span>{" "}
                          {session?.sessionMode}
                        </p>
                        <Link2
                          size={14}
                          className="bg-[#776EA5] text-white rounded-full p-[2px] ml-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* COLLAPSED FOOTER */}
                {!isExpanded && (
                  <div className="flex gap-3">
                    <Button
                      disabled = {!isWithinTwoMinutesBefore(session?.sessionTime?.from)}
                      className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%] disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCall(session?._id, session?.videoRoomName);
                      }}
                    >
                      Start Call
                    </Button>
                    <div className="text-[#6D6A5D] text-xs font-medium">
                      Previous Session:
                      <br />
                      {formatPrettyDate(pastSession?.sessionTime?.from)}
                    </div>
                  </div>
                )}

                {/* EXPANDED VIEW */}
                {isExpanded && (
                  <div
                    className="cursor-pointer"
                    onClick={() => setExpandedIndex(null)}
                  >
                    <div className="flex  justify-between mb-4">
                      <div className="flex gap-3">
                        <Avatar
                          className="w-[87.69px] h-[100px] rounded-[10px]"
                          style={{ width: "87.89px !important" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCounsellorProfile(true);
                          }}
                        >
                          <AvatarImage
                            className="w-[87.69px] h-[100px] rounded-[10px]"
                            src={
                              patient?.practitionerTagged[0]?.generalInformation
                                ?.profileImageUrl
                            }
                            alt={
                              patient?.practitionerTagged[0]?.generalInformation
                                ?.profileImageUrl
                            }
                          />
                          <AvatarFallback>
                            {patient?.practitionerTagged[0]?.generalInformation?.firstName
                              .charAt(0)
                              .toUpperCase() +
                              patient?.practitionerTagged[0]?.generalInformation?.lastName
                                .charAt(0)
                                .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="font-semibold text-base text-black">
                            Dr.{" "}
                            {
                              patient?.practitionerTagged[0]?.generalInformation
                                ?.firstName
                            }{" "}
                            {
                              patient?.practitionerTagged[0]?.generalInformation
                                ?.lastName
                            }
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="hidden gap-3 text-white">
                              <div className="p-2 bg-purple-500 rounded-full">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div className="p-2 bg-purple-500 rounded-full">
                                <Share2 className="w-4 h-4" />
                              </div>
                              <div className="p-2 bg-red-500 rounded-full">
                                <Trash className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div className="text-[#6D6A5D] flex flex-col gap-1">
                            <div>
                              <span className="text-[14px] text-[#6D6A5D] font-medium">
                                <span className="font-bold">Date:</span>{" "}
                                {formatPrettyDate(session?.sessionTime?.from)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[14px] text-[#6D6A5D] font-medium">
                                <span className="font-bold">Time Slot:</span>{" "}
                                {formatSessionTime(session?.sessionTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Chevron icon (rotated) */}
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className="text-sm text-[#6D6A5D] flex flex-col gap-1">
                      <div>
                        <span className="text-[14px] text-[#6D6A5D] font-medium">
                          <span className="font-bold">Session Type:</span>{" "}
                          {session?.sessionMode}
                        </span>
                      </div>
                      <div>
                        <span className="text-[14px] text-[#6D6A5D] font-medium">
                          <span className="font-bold">Previous Session:</span>{" "}
                          {formatPrettyDate(pastSession?.sessionTime?.from) ||
                            "--"}{" "}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center mt-2">
                      <Button
                        variant="outline"
                        className="border-[#CC627B] text-[#CC627B] font-semibold text-[14px] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%] "
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/patient/reschedule-session?reschedule=${session?.sessionTime?.from}&sessionMode=${session?.sessionMode}&sessionId=${session?._id}`
                          );
                        }}
                      >
                        Reschedule Session
                      </Button>
                      <Button
                        disabled={
                          !isWithinTwoMinutesBefore(session?.sessionTime?.from)
                        }
                        className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%] disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCall(session?._id, session?.videoRoomName);
                        }}
                      >
                        Start Call
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-[#00000096] w-full px-3 rounded-[15px] backdrop-blur-[1px]">
            <div className="p-10 flex justify-center items-center m-auto">
              <Button
                className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[173px] h-[45px]"
                onClick={() => {
                  handleBookNowClick();
                }}
              >
                Book Your Sessions
              </Button>
            </div>
          </div>
        )}
        {showCounsellorProfile ? (
          <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
            <div className="relative h-screen overflow-y-auto">
              <Profile
                patient={patient}
                setShowCounsellorProfile={setShowCounsellorProfile}
                setShowCertifications={setShowCertifications}
                setShowClientTestimonials={setShowClientTestimonials}
                doc={therapist}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {showCertifications ? (
          <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
            <div className="relative h-screen overflow-y-auto">
              <Certifications
                setShowCertifications={setShowCertifications}
                doc={patient?.practitionerTagged}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        {showClientTestimonials ? (
          <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
            <div className="relative h-screen overflow-y-auto">
              <Client_Testimonial
                setShowClientTestimonials={setShowClientTestimonials}
                doc={patient?.practitionerTagged}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default UpcomingSession;
