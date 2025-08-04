"use client"
import dynamic from "next/dynamic";
const Schedule_Session = dynamic(() => import('@/components/patient/Schedule-Session/Schedule_Session'),{ssr: false})
// import Schedule_Session from "@/components/patient/Schedule-Session/Schedule_Session";
import React from "react";

const page = () => {
  return (
    <>
      <div className="max-w-[576px] mx-auto">
        <Schedule_Session />
      </div>
    </>
  );
};

export default page;
