"use client";
import React, { useEffect,useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { showErrorToast } from '@/lib/toast';
import { setCookie } from 'cookies-next';
import { setStorage } from '@/lib/utils';
const Landing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("u");
  const axios = axiosInstance();
  useEffect(() => {
    const verifyChannelPartner = async (username) => {
      try {
        
        const response = await axios.post(`v2/cp/channelPartner/verify`, {
          username: username,
        });

        if (response?.data?.success === true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setStorage("channelPartnerData", response.data.data);
          if (response?.data?.data?.billingType == "patientPays") {
            router.push(`/channel-partner/${username}/patient-pay-landing`)
          }
          else{
            router.push(`/channel-partner/${username}`);
          }
        } else {
          showErrorToast(
            response?.data?.error?.message || "Verification failed"
          );
          router.push('/')
        }
      } catch (err) {
        showErrorToast(
          err?.response?.data?.error?.message ||
          "An error occurred while verifying"
        );
        router.push('/')
      }
    };
    verifyChannelPartner(type); // Replace 'apollo' with dynamic username if needed
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-full"
      style={{
        background: `
          linear-gradient(180deg, #DFDAFB 0%, #F9CCC5 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
        `,
      }}>
      <p className="text-2xl font-semibold text-gray-800">
        {type ? `Redirecting to ${type}…` : 'Missing ?u= parameter'}
      </p>
    </div>
  );
}

export default Landing