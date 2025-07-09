import Patient_Pays_Password from '@/components/channel-partner/Patient_Pays_Password/Patient_Pays_Password'
import React from 'react'

const page = async({params}) => {
  const {type} = await params
  return (
    <Patient_Pays_Password type={type}/>
  )
}

export default page
