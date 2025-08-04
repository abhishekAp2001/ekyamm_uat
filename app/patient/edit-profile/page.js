"use client"
import dynamic from "next/dynamic";
const Edit_Patient = dynamic(() => import('@/components/patient/Edit_Patient/Edit_Patient'),{ssr: false})
import React from 'react'

const page = () => {
  return (

    <Edit_Patient/>
    
  )
}

export default page