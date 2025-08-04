"use client"
import dynamic from "next/dynamic";
const CP_bank_details = dynamic(() => import('@/components/sales/channel_partner/CP_bank_Details/CP_bank_details'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
      <CP_bank_details/>
    </>
  )
}

export default page
