"use client"
import dynamic from "next/dynamic";
const Select_Package = dynamic(() => import('@/components/patient/Select_Package/Select_Package'),{ssr: false})
// import Select_Package from '@/components/patient/Select_Package/Select_Package'
import React from 'react'

const page = () => {
  return (
    <>
      <Select_Package/>
    </>
  )
}

export default page
