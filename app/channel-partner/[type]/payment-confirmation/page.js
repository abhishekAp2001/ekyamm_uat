import PaymentConfirmation from '@/components/PaymentConfirmation/PaymentConfirmation'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div>
      <PaymentConfirmation type={type}/>
    </div>
  )
}

export default page
