import Patient_Dashboard from '@/components/Patient_Dashboard/Patient_Dashboard'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] overflow-hidden relative max-w-[576px] m-auto">
    <Patient_Dashboard/>
    </div>
  )
}

export default page
