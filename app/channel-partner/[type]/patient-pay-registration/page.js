import Patient_Pays_Registration from '@/components/channel-partner/Patient_Pays_Registration/Patient_Pays_Registration'
import React from 'react'

const page = async({params}) => {
    const {type} = await params
  return (
    <Patient_Pays_Registration type={type}/>
  )
}

export default page
