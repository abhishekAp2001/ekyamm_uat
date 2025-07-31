"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const IP_Details = dynamic(() => import('@/components/sales/individual_practitioner/IP_Details/IP_Details'), {
  ssr: false,
})

const page = () => {
  return (
    <>
   <IP_Details/>
    </>
  )
}

export default page
