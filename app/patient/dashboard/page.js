"use client"
import dynamic from "next/dynamic";
const Patient_Dashboard = dynamic(() => import('@/components/patient/Patient_Dashboard/Patient_Dashboard'),{ssr: false})
// import Patient_Dashboard from '@/components/patient/Patient_Dashboard/Patient_Dashboard'
import React from 'react'

const page = () => {
  return (

    <Patient_Dashboard/>
    
  )
}

export default page
