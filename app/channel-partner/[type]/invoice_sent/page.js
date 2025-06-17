import NP_Registration from '@/components/NP_Registration/NP_Registration'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div>
      <NP_Registration type={type}/>
    </div>
  )
}

export default page
