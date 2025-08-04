"use client"
import dynamic from "next/dynamic";
const Psychiatrist_profile = dynamic(() => import('@/components/patient/Psychiatrist_profile/Psychiatrist_profile'),{ssr: false})
// import Psychiatrist_profile from '@/components/patient/Psychiatrist_profile/Psychiatrist_profile'
import React from 'react'

const page = () => {
  return (
    <>
    <div className="max-w-[574px] mx-auto">
   <Psychiatrist_profile/>
   </div>
    </>
  )
}

export default page
