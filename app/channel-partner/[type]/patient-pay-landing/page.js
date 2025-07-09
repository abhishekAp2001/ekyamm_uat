import Patient_Pays_Landing from '@/components/channel-partner/Patient_Pays_Landing/Patient_Pays_Landing'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <div className='bg-white h-screen'>
      <Patient_Pays_Landing type={type}/>
    </div>
  )
}

export default page