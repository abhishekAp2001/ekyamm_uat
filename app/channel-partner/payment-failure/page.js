"use client"
import dynamic from "next/dynamic";
const PaymentFailure = dynamic(() => import('@/components/channel-partner/Payment_Failure/PaymentFailure'),{ssr: false})
import React, { Suspense } from 'react'
const page = () => {
  return (
    <Suspense>
      <PaymentFailure/>
    </Suspense>
  )
}

export default page
