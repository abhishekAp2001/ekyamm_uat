"use client"
import dynamic from "next/dynamic";
const Emergency_Details = dynamic(() => import('@/components/patient/Emergency_Details/Emergency_Details'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
     <Emergency_Details/>
    </>
  )
}

export default page
