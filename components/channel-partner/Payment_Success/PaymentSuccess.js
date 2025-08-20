"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, Loader2, X } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { getStorage } from "@/lib/utils";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [hascheck, setHashCheck] = useState(null);
  const channelPartner = getStorage("channelPartnerData")
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
        if(error?.status == 500) return showErrorToast("Something Went Wrong !!!")
        console.error("Error calling webhook:", error);
      }
    };

    if (queryObj.hashIsValid == "0") {
      setHashCheck(false);
      showErrorToast("Payment Failed");
      // setTimeout(() => {
      //   router.push(`/patient/dashboard`);
      // }, 10000);
    } else {
      setHashCheck(true);
      showSuccessToast("Payment Successful");
      // setTimeout(() => {
      //   router.push(`/patient/payment-confirmation?txnid=${queryObj?.txnid}`);
      // }, 10000);
    }

    setLoading(false);
    payu();
  }, [searchParams, router]);

  const query = useSearchParams();
  const txnid = query.get("txnid");

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (loading || hascheck === null) return;

 const timer = setInterval(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

    return () => clearInterval(timer);
  }, [loading, hascheck]);

  // Redirect logic
  useEffect(() => {
    if (seconds === 0 && hascheck === true) {
      router.push(`/channel-partner/${channelPartner.userName}/onspot-payment-confirmation?txnid=${txnid}`);
    } else if (seconds === 0 && hascheck === false) {
      router.push(`/channel-partner/${channelPartner.userName}`);
    }
  }, [seconds, hascheck, router, txnid,channelPartner.userName]);

  const successclose = ()=>{
    router.push(`/channel-partner/${channelPartner.userName}/onspot-payment-confirmation?txnid=${txnid}`)
  }
  const failureClose = ()=>{
    router.push(`/channel-partner/${channelPartner.userName}`);
  }
  return (
    <div className="relative">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] relative">
          <Loader2 className="w-24 h-24 mb-6 animate-spin" />
        </div>
      ) : hascheck === true ? (
        <div className="flex flex-col items-center justify-center gap-[11px] h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5]">
          <Image
            src="/images/Verified-successfully.png"
            width={62}
            height={62}
            className="w-[62.5px] mb-0"
            alt="ekyamm"
          />
          <strong className="text-[16px] text-black font-[600] text-center">
            Payment Successful!
          </strong>
          <p className="text-black text-sm font-medium">
            Redirecting to payment confirmation {seconds} second
            {seconds !== 1 ? "s" : ""}...
          </p>
          <div className="absolute top-4 right-3"
          onClick={successclose}>
              <X width={24} height={24} className="w-8 mb-0" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] px-4">
          <AlertTriangle className="w-24 h-24 text-yellow-600 mb-6" />
          <strong className="text-[16px] text-black font-[600] text-center">
            Security Error
          </strong>
          <p className="text-black text-sm font-medium">
            Redirecting to home page {seconds} second{seconds !== 1 ? "s" : ""}
            ...
          </p>
          <div className="absolute top-4 right-3"
          onClick={failureClose}>
              <X width={24} height={24} className="w-8 mb-0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
