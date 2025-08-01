"use client";
import React, { useEffect,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, XCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { showErrorToast } from "@/lib/toast";
const PaymentFailure = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const queryObj = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });
    const payu = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/webhook/payu`,
          { ...queryObj, isPayuHosted: true }
        );
      } catch (error) {
        console.error("Error calling webhook:", error);
      }
    };
      showErrorToast("Payment Failed");
    payu();
  }, []);


  const query = useSearchParams();
  const txnid = query.get('txnid');

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds === 0) {
      router.push(`/patient/dashboard`);
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, txnid, router]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4 bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] relative">
        <XCircle className="w-24 h-24 text-red-600 mb-6" />
        <strong className="text-[16px] text-black font-[600] text-center">
          Payment Failed
        </strong>
        <p className="text-black text-sm font-medium">
          Redirecting to dashboard {seconds} second{seconds !== 1 ? "s" : ""}
          ...
        </p>
        <div className="absolute top-4 right-3">
            <Link href="/patient/dashboard">
              <X width={24} height={24} className="w-8 mb-0" />
            </Link>
          </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
