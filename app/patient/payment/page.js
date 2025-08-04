"use client"
import dynamic from "next/dynamic";
const Patient_Payment = dynamic(() => import('@/components/patient/Patient_Payment/Patient_Payment'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
      <Patient_Payment/>
    </>
  )
}

export default page
