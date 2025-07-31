"use client";
import dynamic from 'next/dynamic'
import React from 'react'

const IP_General_Information = dynamic(() => import('@/components/sales/individual_practitioner/IP_General_Information/IP_General_Information'), {
  ssr: false,
})

const page = () => {
  return (
    <>
      <IP_General_Information/>
    </>
  )
}

export default page
