"use client"
import dynamic from "next/dynamic";
const CP_billing_details = dynamic(() => import('@/components/sales/channel_partner/CP_billing_Details/CP_billing_details'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
    <CP_billing_details/>
    </>
  )
}

export default page
