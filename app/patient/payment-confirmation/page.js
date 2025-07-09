import PaymentConfirmation from '@/components/patient/PaymentConfirmation/PaymentConfirmation'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
    <PaymentConfirmation/>
    </Suspense>
  )
}

export default page
