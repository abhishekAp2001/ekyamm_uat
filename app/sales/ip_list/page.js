"use client"
import dynamic from "next/dynamic";
const IP_List = dynamic(() => import('@/components/sales/individual_practitioner/IP_List/IP_List'),{ssr: false})
// import IP_List from '@/components/sales/individual_practitioner/IP_List/IP_List'
import React from 'react'

const page = () => {
  return (
    <>
      <IP_List/>
    </>
  )
}

export default page
