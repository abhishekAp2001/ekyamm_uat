"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Baseurl } from "@/lib/constants";
import { getCookie } from "cookies-next";
import { showErrorToast } from "@/lib/toast";
import { patientSessionToken as getPatientSessionToken } from "@/lib/utils";
import { useState, useEffect } from "react";
const Psychiatrist_profile = () => {
  const router = useRouter();
  const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clinic, setClinic] = useState(null);
  const [doctorDrawer, setDoctorDrawer] = useState(false)
  useEffect(() => {
    const token = getPatientSessionToken();
    setPatientSessionToken(token);
  }, []);
  useEffect(() => {
    if (!patientSessionToken) return;
    const getClinicDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient?type=clinic`, {
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          setClinic(response?.data?.data.clinicDetails);
        }
      } catch (err) {
        console.log("err", err);
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      } finally {
        setLoading(false);
      }
    };
    getClinicDetails();
  }, [patientSessionToken]);
  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] relative px-4 overflow-auto max-w-[574px] mx-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center px-4 max-w-[574px] mx-auto">
        <div className="flex justify-between w-full items-center">
          <ChevronLeft size={28} className="text-black cursor-pointer"
            onClick={() => { router.push("/patient/patient-profile") }} />

          <Image src="/images/Chats.png" alt="Chats" width={40} height={43} onClick={() => { router.push('/patient/dashboard') }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="pt-[120px] w-full">
        <div className="flex justify-center items-center rounded-[16px] border bg-[#ffffffd1] w-full h-auto">
          <div className="w-full h-auto px-4 py-6 flex flex-col items-center justify-start text-center">
            {/* CH Circle */}
            <div className="relative w-full flex justify-center">
              <div
                className="w-28 h-28 bg-[#8F82C1] rounded-full flex items-center justify-center text-white font-quicksand font-semibold"
                style={{ fontSize: "50px", marginTop: "-76px" }}
              >
                {clinic?.clinicName
                  ?.split(" ")
                  .slice(0, 2)
                  .map(word => word[0])
                  .join("")
                }
              </div>
            </div>

            {/* Hospital Info */}
            <div className="w-[328px] flex flex-col items-center justify-center mt-2">
              <p className="font-quicksand font-semibold text-[20px] leading-[100%] text-center m-0">
                {clinic?.clinicName}
              </p>
              <p className="text-[15px] font-normal text-center m-0 leading-tight opacity-70">
                {clinic?.generalInformation?.area}, {clinic?.generalInformation?.city}
              </p>

              {/* Icons + Emergency */}
              <div
                className="flex items-center mt-[10px]"
                style={{ gap: "12px" }}
              >
                <div className="flex items-center gap-[10px]">
                  <a href={`tel:${clinic?.generalInformation?.primaryMobileNumber}`}>
                    <Image
                      src="/images/Group 924.png"
                      alt="icon1"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    href={`https://wa.me/${clinic?.generalInformation?.whatsappNumber}?text=hi`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/whatsapp.png"
                      alt="icon2"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a href={`mailto:${clinic?.generalInformation?.email}`}>
                    <Image
                      src="/images/Group 923.png"
                      alt="icon3"
                      width={24}
                      height={24}
                    />
                  </a>
                </div>
                <a href={`tel:${clinic?.generalInformation?.emergencyNumber}`}>
                  <div className="flex items-center bg-[#EC4444] text-white text-[12px] rounded-[5px] px-2 py-1 gap-1">
                    <Image
                      src="/images/call.png"
                      alt="Emergency"
                      width={12}
                      height={12}
                    />
                    <span>Emergency</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Timing */}
            <div className="w-full bg-gradient-to-r from-[#bba3e438] to-[#eda1974d] rounded-[8px] p-[10px] mt-4 px-4 text-left">
              <p className="text-[15px] font-semibold">Timing:</p>
              <p className="text-sm">Open 24 hours</p>
            </div>

            {/* Address */}
            <div className="w-full bg-gradient-to-r from-[#bba3e438] to-[#eda1974d] rounded-[8px] p-[10px] mt-3 text-left">
              <p className="text-[15px] font-semibold">Address:</p>
              <p className="text-sm mt-[2px] leading-snug">
                {clinic?.generalInformation?.area}, {clinic?.generalInformation?.city}
              </p>
              <p className="text-sm mt-[2px] leading-snug">
                {clinic?.generalInformation?.state}, {clinic?.generalInformation?.pincode}
              </p>
            </div>

            {/* Doctor Info */}
            {clinic?.doctorDetails?.doNotDisplay ? (
              <>
              </>
            ) : (
              <div className="w-full h-[56px] flex items-center justify-between bg-gradient-to-r from-[#bba3e438] to-[#eda1974d] rounded-[8px] p-[12px] gap-[10px] mt-3"
                >
                <div className="flex items-center justify-between gap-[10px] w-full"
                onClick={() => { setDoctorDrawer(true) }}>
                  <div className="flex items-center gap-[10px]">
                  <Image
                    src="/images/medical_services.png"
                    alt="Medical Icon"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="text-[15px] font-medium">{clinic?.doctorDetails?.firstName} {clinic?.doctorDetails?.lastName}</span></div>
                  <ChevronLeft className="rotate-180 text-[#8F8F8F]" />
                </div>
                
                {/* Drawer Trigger */}
                <Drawer open={doctorDrawer} onClose={() => setDoctorDrawer(false)}>
                  
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle className="sr-only text-[15px]">Doctor Details</DrawerTitle>
                      <DrawerDescription className="sr-only text-[17px]">
                        Detailed information about the psychiatrist.
                      </DrawerDescription>
                    </DrawerHeader>

                    {/* Actual Visible Content */}
                    <div className="fixed bottom-0 left-0 right-0 w-full  ">

                      <div
                        onClick={() => setDoctorDrawer(false)}
                        className="absolute cursor-pointer"
                        style={{ top: "15px", right: "15px" }}
                        role="button"
                        tabIndex={0}
                      >
                        <Image
                          src="/images/close.png"
                          alt="Close"
                          width={26}
                          height={24}
                        />
                      </div>


                      <div
                        className="rounded-t-[16px] w-full "
                        style={{ background: "linear-gradient(#DFDAFB, #F9CCC5)" }}
                      >
                        <div className="rounded-t-[14px] p-4 bg-gradient-to-b from-[#eeecfb] to-[#eeecfb] shadow-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2 mt-7">
                            <Image
                              src="/images/medical_services.png"
                              alt="icon"
                              width={24}
                              height={24}
                            />
                            <p className="text-[17px] text-black m-0 font-semibold">
                              Doctor Details
                            </p>
                          </div>
                          <h3 className="text-[20px] font-semibold text-black mb-3">
                            {clinic?.doctorDetails?.firstName} {clinic?.doctorDetails?.lastName}
                          </h3>

                          <div className="flex items-center justify-center gap-3 mb-3">
                            <a href={`tel:${clinic?.doctorDetails?.primaryMobileNumber}`}>
                              <Image
                                src="/images/Group 924.png"
                                alt="phone"
                                width={24}
                                height={24}
                              />
                            </a>
                            <a
                              href={`https://wa.me/${clinic?.doctorDetails?.whatsappNumber}?text=hi`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src="/images/whatsapp.png"
                                alt="whatsapp"
                                width={24}
                                height={24}
                              />
                            </a>
                            <a href={`mailto:${clinic?.doctorDetails?.email}`}>
                              <Image
                                src="/images/Group 923.png"
                                alt="mail"
                                width={24}
                                height={24}
                              />
                            </a>
                            <a href={`tel:${clinic?.doctorDetails?.emergencyNumber}`}>
                              <div className="flex items-center gap-1 px-2 py-1 bg-[#EC4444] rounded-[6px] text-white text-[14px] font-semibold">
                                <Image
                                  src="/images/call.png"
                                  alt="call"
                                  width={12}
                                  height={12}
                                />
                                <span>Emergency</span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Psychiatrist_profile;
