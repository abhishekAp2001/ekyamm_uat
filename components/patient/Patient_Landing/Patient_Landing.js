"use client";
import React, { useEffect,useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { showErrorToast } from '@/lib/toast';
import axiosInstance from '@/lib/axiosInstance';
const Patient_Landing= () => {
  const customAxios = axiosInstance();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("u");

  useEffect(() => {
    const verifyChannelPartner = async (username) => {
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: username,
        });

        if (response?.data?.success == true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          if(response?.data?.data?.billingType == "patientPays"){
            router.push('/patient/login')
          }
          else{
            router.push(`/patient/${username}/create`);
          }
        } else {
          showErrorToast(
            response?.data?.error?.message || "Verification failed"
          );
        }
      } catch (err) {
        console.log(err);
        showErrorToast(
          err?.response?.data?.error?.message ||
            "An error occurred while verifying"
        );
      }
    };
    verifyChannelPartner(type); // Replace 'apollo' with dynamic username if needed
  }, [type]);

  return (
    <div className="flex items-center justify-center h-screen w-full"
      style={{
        background: `
          linear-gradient(180deg, #DFDAFB 0%, #F9CCC5 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
        `,
      }}>
      <p className="text-2xl font-semibold text-gray-800">
        {type ? `Redirecting…` : 'Missing ?u= parameter'}
      </p>
    </div>
  );
}

export default Patient_Landing