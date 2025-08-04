"use client"
import dynamic from "next/dynamic";
const PaymentFailure = dynamic(() => import('@/components/patient/payment-failure/PaymentFailure'),{ssr: false})
import React, {Suspense} from 'react'

const Page = () => {
  return (
    <div>
    <Suspense>
      <PaymentFailure/>
    </Suspense>
    </div>
  )
}

export default Page
