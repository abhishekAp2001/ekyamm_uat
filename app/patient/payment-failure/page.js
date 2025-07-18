import PaymentFailure from '@/components/patient/payment-failure/PaymentFailure'
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
