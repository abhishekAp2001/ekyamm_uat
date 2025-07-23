"use client";
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
import { showErrorToast } from "@/lib/toast";
import Image from "next/image";
const UpcomingSession = ({ showUpcomingButtons = true, upcomingsessions }) => {
  const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [patient, setPatient] = useState(null);
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
    const IST_OFFSET = 5.5 * 60;
    const istTime = new Date(utcDate.getTime() + IST_OFFSET * 60 * 1000);
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
          setTherapist(response?.data?.data?.practitionerTagged[0]);
          setCookie(
            "selectedCounsellor",
            JSON.stringify(response?.data?.data?.practitionerTagged[0])
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
    setCookie("selectedCounsellor", JSON.stringify(therapist));
    if (patient.availableCredits === 0) {
      router.push("/patient/select-package");
    } else {
      router.push("/patient/schedule-session");
    }
  };

  const [expanded, setExpanded] = useState(false);
  return (
    // <div>
    //   <Accordion
    //     type="single"
    //     collapsible
    //     className="mt-3"
    //     defaultValue="upcoming-0"
    //   >
    //     {upcomingsessions && upcomingsessions?.length > 0 ? (
    //       upcomingsessions?.map((session, index) => (
    //         <AccordionItem
    //           value={`upcoming-${index}`}
    //           className="rounded-[12px] bg-[#ffffff80] opacity-80 relative mb-1"
    //           key={index}
    //         >
    //           <AccordionTrigger className="flex items-center p-4 dashboard_accordion gap-0">
    //             <div className="flex items-center gap-2 md:gap-3">
    //               <div className="flex flex-col w-[120px] md:w-fit">
    //                 <p className="text-[16px] font-bold text-gray-800 flex flex-col">
    //                   <span className="text-xs text-[#6D6A5D] font-medium">
    //                     {convertUTCtoIST(session?.sessionTime?.from).date}
    //                   </span>
    //                   {convertUTCtoIST(session?.sessionTime?.from).time}
    //                 </p>
    //                 <p className="text-xs text-[#6D6A5D] font-medium">
    //                   {patient?.addressDetails?.area}
    //                 </p>
    //               </div>

    //               <div className="border-gray-300 border w-[1px] h-[56px] mx-0 md:mx-3"></div>

    //               <div className="flex gap-2 md:gap-2">
    //                 <Avatar className="w-[42px] h-[42px]">
    //                   <AvatarImage
    //                     src={patient?.practitionerTagged[0]?.generalInformation?.profileImageUrl}
    //                     alt={patient?.practitionerTagged[0]?.generalInformation?.profileImageUrl}
    //                   />
    //                   <AvatarFallback>
    //                     {patient?.practitionerTagged[0]?.generalInformation?.firstName
    //                       .charAt(0)
    //                       .toUpperCase() +
    //                       patient?.practitionerTagged[0]?.generalInformation?.lastName
    //                         .charAt(0)
    //                         .toUpperCase()
    //                     }
    //                   </AvatarFallback>
    //                 </Avatar>
    //                 <div className="flex flex-col md:gap-1">
    //                   <p className="text-[14px] font-bold text-gray-800">
    //                     {patient?.practitionerTagged[0]?.generalInformation?.firstName} {patient?.practitionerTagged[0]?.generalInformation?.lastName}
    //                   </p>
    //                   <Phone
    //                     size={22}
    //                     className="bg-[#776EA5] fill-white text-white rounded-full p-[4px] hidden"
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </AccordionTrigger>

    //           <AccordionContent className="px-4 pb-4 pt-0">
    //             <div className="pb-2 text-xs">
    //               <p className="text-[#6D6A5D] text-xs font-medium">
    //                 <span className="font-medium">Session Duration:</span>{" "}
    //                 {getTimeDifference(session?.sessionTime?.from, session?.sessionTime?.to)} hours
    //               </p>
    //               <div className="flex items-center">
    //                 <p className="text-[#6D6A5D] text-xs font-medium">
    //                   <span className="font-medium">Session Mode:</span>{" "}
    //                   {session?.sessionMode}
    //                 </p>
    //                 <Link2
    //                   size={14}
    //                   className="bg-[#776EA5] text-white rounded-full p-[2px] ml-1"
    //                 />
    //               </div>
    //             </div>

    //             <div className="flex gap-4 items-center mt-2">
    //               <Button
    //                 variant="outline"
    //                 className="border-[#E7A1A0] text-[#E7A1A0] font-semibold text-[14px] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%] "
    //                 onClick={() => { router.push('/patient/schedule-session') }}
    //               >
    //                 Reschedule Session
    //               </Button>
    //               <Button
    //                 disabled
    //                 className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] opacity-60 text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%]"
    //               >
    //                 Start Call
    //               </Button>
    //             </div>
    //           </AccordionContent>
    //         </AccordionItem>
    //       ))
    //     ) :
    //       (
    //         <div className="bg-[#00000096] w-full px-3 rounded-[15px] backdrop-blur-[1px]">
    //           <div className="p-10 flex justify-center items-center m-auto">
    //             <Button className='bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[173px] h-[45px]'
    //               onClick={() => { handleBookNowClick() }}>Book Your Sessions</Button>
    //           </div>
    //         </div>
    //       )
    //     }
    //   </Accordion>
    // </div>
    <div className="bg-[#FFFFFF80] rounded-2xl p-4 w-full max-w-md mx-auto transition-all duration-300">
      {/* COLLAPSED HEADER */}
      {!expanded && (
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          <div className="flex justify-between">
            <div className="flex gap-2 md:gap-3">
              <div className="flex flex-col w-[120px] md:w-fit">
                <div className="text-[16px] font-bold text-gray-800 flex flex-col">
                  <div className="text-xs text-[#6D6A5D] font-medium">
                    24th Apr
                  </div>
                  <div className="text-base text-black font-bold">11:00 AM</div>
                </div>
                <div className="text-xs text-[#6D6A5D] font-medium">
                  <div className="text-xs text-[#6D6A5D] font-medium">
                    Bandra
                  </div>
                </div>
              </div>
              <div className="border-gray-300 border w-[1px] h-[56px] mx-0 md:mx-3"></div>
              <div className="flex gap-2">
                <Avatar className="w-[42px] h-[42px] border-[2px] border-[#F6FBF7]">
                  <AvatarImage
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
                <div className="flex flex-col md:gap-2">
                  <div className="text-[14px] font-bold text-gray-800">
                    Dr. Kiran Rathi
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
              {/* {getTimeDifference(session?.sessionTime?.from, session?.sessionTime?.to)} */}
              hours
            </p>
            <div className="flex items-center">
              <p className="text-[#6D6A5D] text-xs font-medium">
                <span className="font-medium">Session Mode:</span>{" "}
                {/* {session?.sessionMode}   */}
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
      {!expanded && (
        <div className="flex gap-3">
          <Button
            disabled
            className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] opacity-60 text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%]"
          >
            Start Call
          </Button>
          <div className="text-[#6D6A5D] text-xs font-medium">
            Previous Session:
            <br />
            Tuesday, March 5, 2023
          </div>
        </div>
      )}

      {/* EXPANDED VIEW */}
      {expanded && (
        <div className="cursor-pointer" onClick={() => setExpanded(false)}>
          <div className="flex  justify-between mb-4">
            {/* <Image
                src="/images/Close.svg"
                width={23}
                height={23}
                alt=""
                style={{ cursor: "pointer" }}
              /> */}
            <Avatar className="w-[87.69px] h-[100px] rounded-[10px]">
              <AvatarImage
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
              <div className="font-semibold text-base text-black">Kiran Rathi</div>
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
              <span className="text-[14px] text-[#6D6A5D] font-medium"><span className="font-bold">Date:</span> Tuesday, March 5,
              2023</span>
            </div>
            <div>
              <span className="text-[14px] text-[#6D6A5D] font-medium"><span className="font-bold">Time Slot:</span>11:00am –
              12:00pm</span> 
            </div>
            </div>
            </div>
                {/* Chevron icon (rotated) */}
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
          </div>

          <div className="text-sm text-[#6D6A5D] flex flex-col gap-1">
            <div>
              <span className="text-[14px] text-[#6D6A5D] font-medium"><span className="font-bold">Session Type:</span> Online</span>
            </div>
            <div>
              <span className="text-[14px] text-[#6D6A5D] font-medium"><span className="font-bold">Previous Session:</span> Tuesday,
              March 5, 2023</span>
            </div>
          </div>

          <div className="flex gap-4 items-center mt-2">
            <Button
              variant="outline"
              className="border-[#E7A1A0] text-[#E7A1A0] font-semibold text-[14px] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%] "
              onClick={() => {
                router.push("/patient/schedule-session");
              }}
            >
              Reschedule Session
            </Button>
            <Button
              disabled
              className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] opacity-60 text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[48%]"
            >
              Start Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSession;
