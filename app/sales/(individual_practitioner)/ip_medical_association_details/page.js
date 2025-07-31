"use client"
import dynamic from 'next/dynamic'

const IP_Medical_Association_Details = dynamic(() => import('@/components/sales/individual_practitioner/IP_Medical_Association_Details/IP_Medical_Association_Details'), {
  ssr: false,
})

import React from 'react'

const page = () => {
  return (
    <>
    <IP_Medical_Association_Details/>
    </>
  )
}

export default page
