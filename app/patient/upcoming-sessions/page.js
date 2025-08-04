"use client"
import dynamic from "next/dynamic";
const Upcoming_Sessions = dynamic(() => import('@/components/patient/Upcoming_Sessions/Upcoming_Sessions'),{ssr: false})
// import Upcoming_Sessions from '@/components/patient/Upcoming_Sessions/Upcoming_Sessions'
import React from 'react'

const page = () => {
  return (
    <>
      <Upcoming_Sessions/>
    </>
  )
}

export default page
