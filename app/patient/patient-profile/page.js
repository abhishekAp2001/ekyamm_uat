import Patient_Profile from '@/components/patient/Patient_Profile/Patient_Profile'
import React from 'react'

const page = () => {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 flex flex-col gap-8 bg-[#e7d6ec] max-w-[576px] mx-auto'>
      <Patient_Profile/>
    </div>
  )
}


export default page
