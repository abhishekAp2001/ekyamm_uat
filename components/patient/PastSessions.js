"use client";
import React from 'react'
import { getCookie } from 'cookies-next';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
const PastSessions = ({sessions}) => {
  function convertUTCtoIST(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const IST_OFFSET = 5.5 * 60;
    const istTime = new Date(utcDate.getTime() + IST_OFFSET * 60 * 1000);
    const day = istTime.getDate();
    const month = istTime.toLocaleString('en-US', { month: 'long' });
    const dateStr = `${day} ${month}`;
    let hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const timeStr = `${hours}:${minutesStr} ${ampm}`;
    return { date: dateStr, time: timeStr };
  }
    const [patient, setPatient] = useState(null);
    const router = useRouter()
  useEffect(() => {
    const cookie = getCookie("PatientInfo");
    if (cookie) {
      try {
        setPatient(JSON.parse(cookie));
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
    <div className="">
    <h2 className="text-sm font-semibold py-2">Past Sessions</h2>
    {sessions && sessions?.length > 0 ? (
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
    </>):
    (<>
      <div className="flex items-center justify-center">
        <p className="text-gray-500">No past sessions available</p>
      </div>
    </>)}
  </div>
  )
}

export default PastSessions
