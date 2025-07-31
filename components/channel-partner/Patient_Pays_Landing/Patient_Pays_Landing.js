"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, Circle, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import axios from "axios";
import { showErrorToast } from "@/lib/toast";
const Patient_Pays_Landing = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const verifyChannelPartner = async (username) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/channelPartner/verify`,
          {
            username: type,
          }
        );

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
  }, []);
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image on Right */}
      {/* <div
        className="absolute top-0 right-0 w-full h-full bg-cover bg-center bg-no-repeat  max-[361px]:bg-[10px_42px] max-[376px]:bg-[52px_44px] min-[376px]:bg-[0px_0px] min-[767px]:bg-[150px_80px]"
        style={{
          backgroundImage: "url('/images/relaxed-feminine-woman.png')",
        }}
      /> */}
      {/* <div
        className="absolute top-0 right-0 w-full h-full max-[390px]:bg-size-[287px_677px] bg-contain bg-right lg:bg-cover xl:bg-cover bg-no-repeat  lg:bg-[28%_-319px]"
        style={{
          backgroundImage: "url('/images/relaxed-feminine-woman-left.png')",
        }}
      /> */}
      <div
        className="absolute top-0 right-0 w-full h-full max-[390px]:bg-size-[287px_677px] bg-contain bg-right lg:bg-cover xl:bg-cover bg-no-repeat  lg:bg-[28%_-319px]"
      />
      <Image
        src="/images/relaxed-feminine-woman-left.png"
        width={100}
        height={100}
        className="m-[312px]:w-[312px] min-[358px]:w-[224px] min-[389px]:w-[290px]  md:w-[358px] h-full mix-blend-multiply absolute bottom-0 right-0"
        alt="ekyamm"
      />
      <div className="container mx-auto px-3 pt-[34px] pb-8 relative z-10">
        <div className="grid gap-8 lg:gap-16 items-center">
          {/* Content Section */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4 mb-[40px] md:mb-5">
              <div className="flex flex-col mb-[30px] md:mb-[34px]">
                <div className="md:mt-4">
                  <strong className="text-[34px] md:text-[38px] text-[#776EA5] font-bold leading-[34px]">
                    Balance Your{" "}
                  <strong className="text-[34px] md:text-[38px] text-[#CC627B] font-bold leading-[34px]">
                      Mind
                    <strong className="text-[34px] md:text-[38px]  text-[#776EA5] font-bold px-[10px]">
                      &
                    </strong>
                    Body
                    </strong>
                  </strong>
                    {/* <strong className="text-[34px] text-[#CC627B] font-bold leading-[34px]">
                      Body
                    </strong> */}
                    {/* <strong className="text-[34px] text-[#776EA5] font-bold">
                      for
                    </strong> */}
                  {/* <div className="leading-6 flex items-center gap-[10px] pb-[6px]">
                    <strong className="text-[34px] text-[#CC627B] font-bold leading-[34px]">
                      Mind
                    </strong>
                    <strong className="text-[34px] text-[#776EA5] font-bold">
                      &
                    </strong>
                    <strong className="text-[34px] text-[#CC627B] font-bold leading-[34px]">
                      Body
                    </strong>
                    <strong className="text-[34px] text-[#776EA5] font-bold">
                      for
                    </strong>
                  </div> */}
                  <br className="block"/>
                  <strong className="text-[34px] md:text-[38px] text-[#776EA5] font-bold leading-[34px] md:ps-[0px] md:mt-1">
                  for Better Fertility
                  </strong>
                </div>
              </div>
              <div className="w-[290px] md:w-[494px] text-black mt-7 md:mt-0">
                <p className="text-[16px] md:text-[20px] font-medium leading-[19px] md:leading-[22px] opacity-80">
                  Trying to conceive, is one of the most emotional journeys
                  you&apos;ll ever take.
                </p>
                <p className="text-[16px] md:text-[21px] font-bold leading-[19px] md:leading-[22px] mt-6 opacity-80 md:mt-6">
                  The waiting, the hope, the setbacks. <br className="hidden md:block"/>It&apos;s a lot to carry.
                </p>
              </div>
            </div>

            {/* Feature Points */}
            <div className="space-y-2 md:mt-[34px]">
         
              <div className="flex items-center gap-2 mb-[11px] md:mb-[6px]">
                <div className="flex-shrink-0 w-6 h-6 bg-[#776EA5] rounded-full flex items-center justify-center">
                  {/* <Image
                    src="/images/network_intelligence.png"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-cover"
                    alt="success"
                  /> */}
                  <Brain color="white" width={16} height={16} />
                </div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-black text-[16px] md:text-[20px]">
                    Mind -{" "}
                  </h3>
                  <p className="text-black text-[16px] md:text-[18px] opacity-80">
                    Reduce stress & anxiety
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-[11px] md:mb-[6px]">
                <div className="flex-shrink-0 w-6 h-6 bg-[#776EA5] rounded-full flex items-center justify-center">
                  {/* <Image
                    src="/images/self_improvement.png"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-cover"
                    alt="success"
                  /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="16"
                    height="16"
                    fill="white"
                  >
                    <circle cx="32" cy="12" r="6" />
                    <path d="M32 22c-6.627 0-12 5.373-12 12v4h-4l-8 12h8l8-8v8h8v-8h4v8h8v-8l8 8h8l-8-12h-4v-4c0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 ">
                  <h3 className="font-semibold text-black text-[16px] md:text-[20px]">
                    Body -{" "}
                  </h3>
                  <p className="text-black text-[16px] md:text-[18px] opacity-80">Strength</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-[11px] md:mb-[6px]">
                <div className="flex-shrink-0 w-6 h-6 bg-[#776EA5] rounded-full flex items-center justify-center">
                  {/* <Image
                    src="/images/digital_wellbeing.png"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-cover"
                    alt="success"
                  /> */}
                  <div className="flex flex-col items-center">
                    <Circle color="white" width={7} height={7} fill="white" />
                    <Heart color="white" width={10} height={10} fill="white" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-black text-[16px] md:text-[20px]">
                    Emotion -{" "}
                  </h3>
                  <p className="text-black text-[16px] md:text-[18px] opacity-80">
                    Stay connected & supported
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-6  max-[376px]:mt-0 min-[389px]:mt-[34%] max-[391px]:mt-[34%] min-[391px]:mt-[40%] min-[415px]:mt-[40%] md:mt-[6%]">
              <div className="space-y-2">
                {/* <h2 className="text-[20px] font-bold text-[#776EA5] leading-6">
                  A healthier <br /> mind & body
                  <br /> improves
                  <br /> fertility outcomes.
                </h2> */}
                 <h2 className="text-[20px] md:text-[22px] font-bold text-[#776EA5] leading-6 md:leading-[30px] w-[200px] md:w-[300px]">
                 <span className="md:text-[30px] md:leading-[34px]"> A healthier,<br className='pr-2 md:pr-0'/>  mind & body</span><br className="block"/>
                   improves
                   
                  fertility outcomes.
                </h2>
              </div>
              <Button
                variant="outline"
                className="flex-1 bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[20px] text-white rounded-[7.26px] w-[198px] h-[45px]"
                onClick={() => {
                  router.push(
                    `/channel-partner/${type}/patient-pay-registration`
                  );
                }}
              >
                Get Support Now
              </Button>
              {/* <div className="flex gap-1 items-center fixed bottom-[26px]"> */}
              <div className="flex gap-1 items-center pb-[26px]">
                <span className="text-[10px] md:text-[16px] text-gray-500 font-medium">
                  Powered by
                </span>
                <Image
                  src="/images/ekyamm.png"
                  width={77}
                  height={17}
                  className="w-[77px] md:w-[86px] mix-blend-multiply"
                  alt="ekyamm"
                />
              </div>
            </div>
          </div>

          {/* Empty space for background image */}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Patient_Pays_Landing;
