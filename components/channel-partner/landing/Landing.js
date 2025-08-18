"use client";
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { showErrorToast } from '@/lib/toast';
import { setCookie } from 'cookies-next';
import { clearStorageAndCookies, setStorage } from '@/lib/utils';
import Image from 'next/image';

const Landing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("u");
  const axios = axiosInstance();

  useEffect(() => {
  clearStorageAndCookies(["PatientInfo", "patientSessionData", "selectedCounsellor", "user","rememberMe"])
    const verifyChannelPartner = async (username) => {
      try {
        const response = await axios.post(`v2/cp/channelPartner/verify`, {
          username: username,
        });

        if (response?.data?.success === true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setStorage("channelPartnerData", response?.data?.data);
          if (response?.data?.data?.billingType == "patientPays") {
            router.push(`/channel-partner/${username}/patient-pay-landing`)
          } else {
            router.push(`/channel-partner/${username}`);
          }
        } else {
          showErrorToast(
            response?.data?.error?.message || "Verification failed"
          );
          router.push('/');
        }
      } catch (err) {
        if(err?.status == 500) return showErrorToast("Something Went Wrong !!!")
        showErrorToast(
          err?.response?.data?.error?.message ||
          "An error occurred while verifying"
        );
        router.push('/');
      }
    };
    if (type) verifyChannelPartner(type);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-full"
      style={{
        background: `
          linear-gradient(180deg, #DFDAFB 0%, #F9CCC5 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
        `,
      }}
    >
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
};

export default Landing;
