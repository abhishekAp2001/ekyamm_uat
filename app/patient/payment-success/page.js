import React, { Suspense } from 'react'
import PaymentSuccess from '@/components/patient/payment-success/PaymentSuccess'
const page = () => {
  return (
    <Suspense>
      <PaymentSuccess/>
    </Suspense>
  )
}

export default page
