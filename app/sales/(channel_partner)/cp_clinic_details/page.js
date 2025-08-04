"use client"
import dynamic from "next/dynamic";
const CP_clinic_details = dynamic(() => import('@/components/sales/channel_partner/CP_clinic_Details/CP_clinic_details'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
       <CP_clinic_details/>
    </>
  )
}

export default page
