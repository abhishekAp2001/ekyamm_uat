import OTP_Send from '@/components/Otp_Send/OTP_Send'
import React from 'react'

const page = async({params}) => {
  const {type} = await params

  return (
    <>
    <OTP_Send type={type}/>
    </>
  )
}

export default page
