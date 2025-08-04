"use client"
import dynamic from "next/dynamic";
const CP_List = dynamic(() => import('@/components/sales/channel_partner/CP_List/CP_List'),{ssr: false})
// import CP_List from '@/components/sales/channel_partner/CP_List/CP_List'
import React from 'react'

const page = () => {
  return (
    <>
      <CP_List/>
    </>
  )
}

export default page
