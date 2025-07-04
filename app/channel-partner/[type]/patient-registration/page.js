import IP_Details from '@/components/sales/individual_practitioner/IP_Details/IP_Details'
import Patient_Registration from '@/components/channel-partner/Patient_Registration/patient_Registration'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  // console.log(type)
  return (
    <>
   <Patient_Registration type={type}/>
    </>
  )
}

export default page
