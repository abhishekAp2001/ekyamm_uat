"use client"
import dynamic from "next/dynamic";
const P_Pay_For_Session = dynamic(() => import('@/components/patient/P_Pay_For_Session/P_Pay_For_Session'),{ssr: false})
import React from 'react'

const page = () => {
  return (
    <>
      <P_Pay_For_Session/>
    </>
  )
}

export default page
