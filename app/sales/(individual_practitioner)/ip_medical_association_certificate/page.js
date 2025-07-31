"use client"
import dynamic from 'next/dynamic'

const IP_Medical_Association_Certificate = dynamic(() => import('@/components/sales/individual_practitioner/IP_Medical_Association_Certificate/IP_Medical_Association_Certificate'), {
  ssr: false,
})

import React from 'react'

const page = () => {
  return (
    <>
    <IP_Medical_Association_Certificate/>
    </>
  )
}

export default page
