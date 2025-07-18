'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import axios from 'axios';

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [hascheck, setHashCheck] = useState(null);

  useEffect(() => {
    const queryObj = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const payu = async () => {
      try {
        const cleanQuery = { ...queryObj };
        delete cleanQuery.hashIsValid;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/webhook/payu`,
          { ...cleanQuery, isPayuHosted: true }
        );
      } catch (error) {
        console.error('Error calling webhook:', error);
      }
    };

    if (queryObj.hashIsValid == '0') {
      setHashCheck(false);
      showErrorToast('Payment Failed');
      setTimeout(() => {
        router.push(`/patient/dashboard`);
      }, 10000);
    } else {
      setHashCheck(true);
      showSuccessToast('Payment Successful');
      setTimeout(() => {
        router.push(`/patient/payment-confirmation?txnid=${queryObj?.txnid}`);
      }, 10000);
    }

    setLoading(false);
    payu()
  }, [searchParams, router]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <Loader2 className="w-24 h-24 mb-6 animate-spin" />
        </div>
      ) : hascheck === true ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
          <CheckCircle className="w-24 h-24 text-green-600 mb-6" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Payment Successful!
          </h1>
          <p className="text-green-800 text-lg">Thank you.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
          <AlertTriangle className="w-24 h-24 text-yellow-600 mb-6" />
          <h1 className="text-3xl font-bold text-yellow-700 mb-2">
            Security Error
          </h1>
          <p className="text-yellow-800 text-lg">Redirecting…</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
