'use client';
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
const PaymentFailure = () => {
    const router = useRouter()
    useEffect(()=>{
         setTimeout(() => {
        router.push(`/patient/dashboard`);
      }, 10000);
    },[])
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
          <XCircle className="w-24 h-24 text-red-600 mb-6" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">
            Payment Failed
          </h1>
          <p className="text-yellow-800 text-lg">Redirecting…</p>
        </div>
    </div>
  )
}

export default PaymentFailure
