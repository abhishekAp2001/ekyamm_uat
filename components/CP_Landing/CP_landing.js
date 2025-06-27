"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { showErrorToast } from "@/lib/toast";
import { getCookie, setCookie } from "cookies-next";
import { MapPin } from "lucide-react";

const CP_landing = ({ type }) => {
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const axios = axiosInstance();

  useEffect(() => {
    const verifyChannelPartner = async (username) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(`v2/cp/channelPartner/verify`, {
          username: type,
        });

        if (response?.data?.success === true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setChannelPartnerData(response.data.data);
        } else {
          showErrorToast(
            response?.data?.error?.message || "Verification failed"
          );
        }
      } catch (err) {
        // console.log(err);
        showErrorToast(
          err?.response?.data?.error?.message ||
            "An error occurred while verifying"
        );
      } finally {
        setLoading(false);
      }
    };
    verifyChannelPartner(type); // Replace 'apollo' with dynamic username if needed
  }, [type]);
  return (
    <>
      <div className="bg-white h-screen">
        <div className="flex flex-col items-center h-full text-center">
          <div className="">
            <h1 className="text-[32px] text-[#776EA5] font-semibold max-[431px]:mt-[34%] mt-[22%] sm:mt-[28%] md:mt-[28%] lg:mt-[8%]">
              {channelPartnerData?.clinicName || "Greetings Hospital"} 
            </h1>
            <div className="flex justify-center items-center gap-[2px]">
              <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
              <MapPin color="white" className="w-[12.15px] h-[12.15px]"/></div>
              <span className="text-sm text-[#776EA5] font-medium">
                {channelPartnerData?.area} 
              </span>
            </div>
          </div>
          <div className="max-[431px]:my-[40px] min-[567px]:my-[50px] lg:my-4 flex flex-col items-center gap-[30px]">
            <div className="flex flex-col text-center">
              <div className="">
                <strong className="text-[36px] text-[#776EA5] font-bold leading-[34px]">
                  Balance Your{" "}
                </strong>
                <div className="leading-6 flex items-center gap-[10px] pb-[6px]">
                  <strong className="text-[36px] text-[#CC627B] font-bold leading-[34px]">
                    Mind
                  </strong>
                  <strong className="text-[36px] text-[#776EA5] font-bold">
                    &
                  </strong>
                  <strong className="text-[36px] text-[#CC627B] font-bold leading-[34px]">
                    Body
                  </strong>
                  <strong className="text-[36px] text-[#776EA5] font-bold">
                    for
                  </strong>
                </div>
                <strong className="text-[36px] text-[#776EA5] font-bold leading-[34px]">
                  Better Fertility
                </strong>
              </div>
            </div>
              <Link
                href={`/channel-partner/${type}/otp_send`}
                className="text-[15px] text-white"
              >
            <Button className=" bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] h-[45px]  rounded-[8px] flex items-center justify-center w-[198px]">
                Add Patient
            </Button>
              </Link>
            <div className="flex gap-1 items-center">
              <span className="text-[10px] text-gray-500 font-medium">
                Powered by
              </span>
              <Image
                src="/images/ekyamm.png"
                width={77}
                height={17}
                className="w-[77px] mix-blend-multiply"
                alt="ekyamm"
              />
            </div>
          </div>
          <div className="bg-[url(/images/relaxed-feminine-woman.png)] bg-contain sm:bg-cover md:bg-cover lg:bg-contain bg-bottom bg-no-repeat w-full h-full"></div>
        </div>
      </div>
    </>
  );
};

export default CP_landing;
