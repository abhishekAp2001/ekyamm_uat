import Payment from '@/components/channel-partner/Payment/Payment'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div>
      <Payment type={type}/>
    </div>
  )
}

export default page
