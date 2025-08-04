"use client"
import dynamic from "next/dynamic";
const Sessions_Synopsis = dynamic(() => import('@/components/patient/Sessions_Synopsis/Sessions_Synopsis'),{ssr: false})
// import Sessions_Synopsis from '@/components/patient/Sessions_Synopsis/Sessions_Synopsis'
import React from 'react'

const page = () => {
  return (
    <>
      <Sessions_Synopsis/>
    </>
  )
}

export default page
