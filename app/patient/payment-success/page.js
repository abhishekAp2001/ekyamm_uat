"use client"
import dynamic from "next/dynamic";
const PaymentSuccess = dynamic(() => import('@/components/patient/payment-success/PaymentSuccess'),{ssr: false})
import React, { Suspense } from 'react'
const page = () => {
  return (
    <Suspense>
      <PaymentSuccess/>
    </Suspense>
  )
}

export default page
