'use client';
import React from 'react'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { showSuccessToast } from '@/lib/toast';
import axios from 'axios';
import { Baseurl } from '@/lib/constants';
const PaymentSuccess = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    useEffect(() => {
        const queryObj = {};
        searchParams.forEach((value, key) => {
            queryObj[key] = value;
        });

        const payu = async () => {
            try {
                const response = await axios.post(
                    `${Baseurl}/v2/webhook/payu`,
                    queryObj
                );
                console.log('Webhook response:', response.data);
            } catch (error) {
                console.error('Error calling webhook:', error);
            }
        };

        payu();

        if (queryObj?.status === "success") {
            showSuccessToast("Payment Successful")
            setTimeout(() => {
                router.push(`/patient/payment-confirmation?txnid=${queryObj?.txnid}`);
            }, 1000);
        }
    }, [searchParams, router]);

  return (
    <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
    <CheckCircle className="w-24 h-24 text-green-600 mb-6" />
    <h1 className="text-3xl font-bold text-green-700 mb-2">
      Payment Successful!
    </h1>
    <p className="text-green-800 text-lg">
      Thank you.
    </p>
  </div>
    </div>
  )
}

export default PaymentSuccess
