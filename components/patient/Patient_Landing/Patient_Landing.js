"use client";
import React, { useEffect,useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { showErrorToast } from '@/lib/toast';
import axiosInstance from '@/lib/axiosInstance';
import { clearStorageAndCookies, setStorage } from '@/lib/utils';
import Image from 'next/image';
const Patient_Landing= () => {
  const customAxios = axiosInstance();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("u");

  useEffect(() => {
    clearStorageAndCookies([])
    const verifyChannelPartner = async (username) => {
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: username,
        });

        if (response?.data?.success == true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setStorage("channelPartnerData", response?.data?.data);
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
        if(err?.status == 500) return showErrorToast("Something Went Wrong !!!")
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
    <div className="flex flex-col items-center justify-center h-screen w-full"
      style={{
        background: `
          linear-gradient(180deg, #DFDAFB 0%, #F9CCC5 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
        `,
      }}>
     <Image
             alt="ekyamm"
             src="/images/ekyamm.png"
             width={200} // set your desired width
             height={200} // set your desired height
             priority
           />
           <p className="mt-4 text-lg font-medium text-gray-700">
             Loading
           </p>
    </div>
  );
}

export default Patient_Landing