'use client'
import dynamic from 'next/dynamic'
import React from 'react'
const CP_type = dynamic(() => import('@/components/CP_type/CP_type'),{ssr: false})

const page = () => {
  return (
    <>
      <CP_type/>
    </>
  )
}

export default page
