"use client"
import dynamic from "next/dynamic";
const PaymentConfirmation = dynamic(() => import('@/components/patient/PaymentConfirmation/PaymentConfirmation'),{ssr: false})
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
    <PaymentConfirmation/>
    </Suspense>
  )
}

export default page
