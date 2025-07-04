import PayForSessions from '@/components/channel-partner/PayForSessions/PayForSessions'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div>
      <PayForSessions type={type}/>
    </div>
  )
}

export default page
