import OTP_Verify from '@/components/Otp_Verify/OTP_Verify'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <>
    <OTP_Verify type={type}/>
    </>
  )
}

export default page
