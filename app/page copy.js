import Navbar from '@/components/sales/Navbar/Navbar'
import SalesDashboard from '@/components/sales/Sales_Dashboard/SalesDashboard'
import Section from '@/components/sales/Section1/Section'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] overflow-hidden relative">
      HTML SITE 2.24.06 
      <Navbar/>
      <Section/>
    </div>
  )
}

export default page
