import OnSpotPaymentConfirmation from '@/components/channel-partner/onspot-payment-confirmation/OnSpotPaymentConfirmation'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div>
      <OnSpotPaymentConfirmation type={type}/>
    </div>
  )
}

export default page
