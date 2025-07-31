'use client'
import dynamic from "next/dynamic";
import React from 'react'
const IP_bank_details = dynamic(() => import('@/components/sales/individual_practitioner/IP_bank_Details/IP_bank_details'), {
  ssr: false,
})

const page = () => {
  return (
    <>
      <IP_bank_details/>
    </>
  )
}

export default page
