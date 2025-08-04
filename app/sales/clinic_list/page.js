"use client"
import dynamic from "next/dynamic";
const Clinic_List = dynamic(() => import('@/components/sales/Clinic_List/Clinic_List'),{ssr: false})
// import Clinic_List from '@/components/sales/Clinic_List/Clinic_List'
import React from 'react'

const page = () => {
  return (
    <>
      <Clinic_List/>
    </>
  )
}

export default page
