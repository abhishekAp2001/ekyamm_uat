

import Cloudnine_Hospital from '@/components/Cloudnine_Hospital/Cloudnine_hospital'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div>
      <Cloudnine_Hospital type={type} />
    </div>
  )
}

export default page
