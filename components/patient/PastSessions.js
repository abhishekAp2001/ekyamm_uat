"use client";
import React from 'react'
import { getCookie } from 'cookies-next';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRememberMe } from '@/app/context/RememberMeContext';
import { getStorage } from '@/lib/utils';
const PastSessions = ({sessions}) => {
  const { rememberMe } = useRememberMe();
function convertUTCtoIST(utcDateStr) {
  const date = new Date(utcDateStr);

  const options = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "long",
  };

  const formatter = new Intl.DateTimeFormat("en-IN", options);
  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value;

  return {
    date: `${day} ${month}`,
    time: `${hour}:${minute} ${dayPeriod}`,
  };
}
    const [patient, setPatient] = useState(null);
    const router = useRouter()
  useEffect(() => {
    // const cookie = getCookie("PatientInfo");
    const cookie = getStorage("PatientInfo", rememberMe);
    if (cookie) {
      try {
        setPatient(cookie);
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
    else if(!cookie){
      router.push('/patient/login')
    }
  }, []);
  function formatUTCDateToCustomString(utcDateStr) {
  const date = new Date(utcDateStr);

  const options = {
    weekday: 'short',
    month: 'short',  
    day: 'numeric',  
    year: 'numeric', 
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    ...options,
    timeZone: 'UTC'
  });

  return formattedDate;
}
  return (
    <>
    {sessions && sessions?.length > 0 ? (
    <div className="">
    <h2 className="text-sm font-semibold py-2">Past Sessions</h2>
    <>
      {sessions?.map((session, index) => (
      <div
        key={index}
        className="flex gap-2 items-center rounded-[12px] bg-[#ffffff80] opacity-80 relative px-3 py-2  mb-2"
      >
        <div className="text-sm font-semibold text-gray-black flex flex-col">
          <span className='text-xs text-[#6D6A5D] font-medium'>{convertUTCtoIST(session?.sessionTime?.from).date}</span>
          {convertUTCtoIST(session?.sessionTime?.from).time}
        </div>
        <div className="border-gray-300 border w-[1px] h-[38px]"></div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-black">
            {patient?.practitionerTagged[0]?.generalInformation?.firstName} {patient?.practitionerTagged[0]?.generalInformation?.lastName}
          </p>
          <p className="text-xs text-[#6D6A5D] font-medium">
            Previous Session <br />
            {formatUTCDateToCustomString(session?.sessionTime?.from)}
          </p>
        </div>
      </div>
    ))}
    </>
  </div>):
    (<>
      {/* <div className="flex items-center justify-center">
        <p className="text-gray-500">No past sessions available</p>
      </div> */}
    </>)}
    </>
  )
}

export default PastSessions
