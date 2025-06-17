import IP_Details from '@/components/IP_Details/IP_Details'
import Patient_Registration from '@/components/Patient_Registration/patient_Registration'
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
