"use client"
import dynamic from "next/dynamic";
const CP_doctor_details = dynamic(() => import('@/components/sales/channel_partner/CP_doctor_Details/CP_doctor_details'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
     <CP_doctor_details/>
    </>
  )
}

export default page
