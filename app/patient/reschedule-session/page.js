"use client"
import dynamic from "next/dynamic";
const Reschedule_Session = dynamic(() => import('@/components/patient/Reschedule_Session/Reschedule_Session'),{ssr: false})
// import Reschedule_Session from '@/components/patient/Reschedule_Session/Reschedule_Session'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <>
      <Suspense>
        <Reschedule_Session/>
      </Suspense>
    </>
  )
}

export default page
