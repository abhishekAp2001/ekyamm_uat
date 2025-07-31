"use client"
import dynamic from 'next/dynamic'
const IP_Single_Session_Fees = dynamic(() => import('@/components/sales/individual_practitioner/IP_Single_Session _Fees/IP_Single_Session _Fees'), {
  ssr: false,
})
import React from 'react'

const page = () => {
  return (
    <>
      <IP_Single_Session_Fees/>
    </>
  )
}

export default page
