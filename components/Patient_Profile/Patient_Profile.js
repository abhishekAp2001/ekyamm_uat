"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import PP_Header from "../PP_Header/PP_Header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ChevronLeft } from "lucide-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Profile from "../patient/practitioner/Profile";
const sessionData = [
  {
    date: "24th Apr",
    time: "12:00 AM",
    doctor: "Dr. Ramesh Naik",
    previous: "Tuesday, March 25, 2023",
  },
  {
    date: "14th Apr",
    time: "10:30 AM",
    doctor: "Dr. Suresh Sawant",
    previous: "Tuesday, March 15, 2023",
  },
  {
    date: "2nd Apr",
    time: "09:30 AM",
    doctor: "Dr. Neeta Singh",
    previous: "Tuesday, Feb 25, 2023",
  },
];

const Patient_Profile = () => {
  const router = useRouter();
  const patient = JSON.parse(getCookie("PatientInfo"))
  console.log("Patient Profile Data:", patient);
  const [activeIndex, setActiveIndex] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile1] = useState("");
  const [showCounsellorProfile, setShowCounsellorProfile] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showClientTestimonials, setShowClientTestimonials] = useState(false);
  const handleInputChange = (e, setMobile) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setMobile(digitsOnly);
    }
  };

  const toggleSection = (idx) => {
    setActiveIndex((prev) => {
      const newIndex = prev === idx ? null : idx;
      setTimeout(() => {
        const section = document.getElementById(`scrollable-section-${idx}`);
        if (section) {
          section.scrollTop = 0;
        }
      }, 100);
      return newIndex;
    });
  };

  const handleRouting = (route) => {
    if (route) {
      router.push(route);
    }
  }
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px] mx-auto">
      <div className="">
        <div className="flex items-center justify-between p-5">
          {/* Left Icon */}
          <ChevronLeft size={28} className="text-black cursor-pointer" 
          onClick={()=>{router.push("/patient/dashboard")}}/>
          {/* Right Side Image */}
          <Image
            src="/images/box.png"
            width={28}
            height={18}
            alt="right-icon"
            className="bg-transparent"
          />
        </div>
      </div>
      <div className="h-full  overflow-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] pb-5">
        {/* Profile Image */}
        {/* Main Card */}
        <div className="bg-[#FFFFFF]  p-6 pb-1 mt-[55px] rounded-[16px]">
          <div className="flex justify-center  rounded-[17.63px] mx-auto relative mb-6 mt-[-77px]">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage
                src={patient?.profileImageUrl}
                alt={`${patient?.firstName} ${patient?.lastName}`}
                className="rounded-full object-cover"
              />
              <AvatarFallback>
                {`${patient?.firstName} ${patient?.lastName}`
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Drawer className="pt-[9.97px]">
              <DrawerTrigger className="">
                <Image
                  src="/images/camera.png"
                  width={31}
                  height={31}
                  className="w-[31px] h-fit absolute bottom-[2px] right-[33%] lg:right-[40%]"
                  alt="camera"
                />
              </DrawerTrigger>
              <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col gap-3">
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px] rounded-[8.62px]">
                      <Link href={"/cp_type"}>Take Photo</Link>
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px] rounded-[8.62px]">
                      <Link href={""}>Choose Photo</Link>
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px] rounded-[8.62px]">
                      <Link href={""}>Delete Photo</Link>
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="p-0"></DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <strong className="flex text-[20px] font-[600] text-black items-center justify-center mb-2">
            {patient?.firstName} {patient?.lastName}
          </strong>

          <div className="flex text-[14px] font-[500] text-gray-500 items-center justify-center">
            +91 {patient?.primaryMobileNumber}
            <Image
              src="/images/edit.png"
              width={10}
              height={10}
              alt="edit"
              className="mx-2"
            />
          </div>

          <div className="flex text-[14px] font-[500] text-gray-500 items-center justify-center mb-4">
            {patient?.email ? patient.email : "-------"}
            <Image
              src="/images/edit.png"
              width={10}
              height={10}
              alt="edit"
              className="mx-2"
            />
          </div>

          {/* Menu Items */}
          {[
            {
              label: "Sessions",
              icon: "/images/schedule_icon.png",
              bold: true,
              info: true,
              onclick: () => {
                router.push("/patient/upcoming-sessions");
              },
              disabled: false
            },
            {
              label: "Sessions Synopsis",
              icon: "/images/schedule_icon.png",
              bold: true,
              info: true,
              onclick: () => {
                router.push("/patient/sessions-synopsis");
              },
              disabled: false
            },
            {
              label: "Therapist Details",
              icon: "/images/mindfulness.png",
              bold: true,
              info: true,
              onclick: () => {
                setShowCounsellorProfile(true);
              },
              disabled: false
            },
            {
              label: "Call In-Clinic Psychologist",
              icon: "/images/wifi_calling_bar_1.png",
              bold: false,
              info: false,
              disabled: true
            },
            {
              label: "Clinic Details",
              icon: "/images/medical_services.png",
              bold: true,
              info: true,
              onclick: () => {
                router.push("/patient/psychiatrist-profile");
              },
              disabled: false
            },
          ].map((item, idx) => (
            <div key={idx} className="mb-4">
              <button className="bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[8px] p-2 h-[56px] p-3 w-full text-left flex items-center justify-between {}"
              onClick={item.onclick}
              disabled={item.disabled}>
                <span className="flex items-center text-[14px] font-[600] text-black ml-1">
                  <Image
                    src={item.icon}
                    width={24}
                    height={24}
                    alt="icon"
                    className="mr-2 w-6 h-6"
                  />
                  {item.label}
                  {item.info && (
                    <Image
                      src="/images/group1.png"
                      width={13}
                      height={13}
                      alt="info"
                      className="ml-1 w-[13.6px] h-[13.6px]"
                    />
                  )}
                </span>
                <Image
                  src="/images/arrow1.png"
                  width={7}
                  height={13}
                  alt="arrow"
                  className="w-[7.47px] h-[13.36px] mr-1"
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-[13px]">
          <Drawer>
            <DrawerTrigger className="w-full">
              <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
                Edit Profile
              </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] rounded-t-[16px] max-w-[576px] mx-auto bottom-drawer">
              <DrawerHeader>
                <DrawerDescription className="flex flex-col px-4">
                  {/* Stepper Line */}
                  <div className="flex justify-center items-center mt-[10px] mb-[25px]">
                    <div className="flex items-center w-[324px] h-[11px]">
                      {[0, 1, 2].map((step, idx) => (
                        <React.Fragment key={idx}>
                          {/* Step circle */}
                          <div
                            className={`w-2 h-2 rounded-full border-[3px] ${
                              step === 0 || (otpSent && step <= 1)
                                ? "bg-[#776EA5] border-[#776EA5]"
                                : "bg-gray-300 border-gray-400"
                            }`}
                          ></div>

                          {/* Step line (not after last circle) */}
                          {idx < 2 && (
                            <div
                              className={`flex-1 h-[2px] ${
                                otpSent && step === 0
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* OTP Input UI */}
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-[16px] font-[600] text-black mb-[12px]">
                      Verify Yourself
                    </span>
                    <span className="text-[14px] font-[500] text-black text-center">
                      Enter OTP shared on your mobile number
                    </span>

                    <div className="mt-[32px]">
                      <InputOTP maxLength={6} className="gap-2">
                        <InputOTPGroup className="flex gap-3">
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="rounded-[9.23px] h-[45px] w-[45px] border-[1.54px] border-[#776EA5] text-base text-black"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </DrawerDescription>
              </DrawerHeader>

              <DrawerFooter className="p-4">
                <div className="flex justify-between items-center gap-3 w-full">
                  <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] rounded-[8px] w-[48%] h-[45px]">
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white rounded-[8px] w-[48%] h-[45px]">
                    Send OTP
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* verified successfully */}
        <div className="hidden">
          <div className="flex justify-center pt-[13px]">
            <Drawer>
              <DrawerTrigger className="w-full">
                <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
                  Edit Profile
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] h-[330]">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col">
                    {/* Stepper Line */}

                    <div className="flex justify-center items-center mt-2 mb-4">
                      <div className="flex items-center w-[324px] h-[11px]">
                        {[0, 1, 2].map((step, idx) => (
                          <React.Fragment key={idx}>
                            {/* Step circle */}
                            <div
                              className={`w-2 h-2 rounded-full border-2 ${
                                step === 0 || (otpSent && step <= 1)
                                  ? "bg-green-500 border-green-500"
                                  : "bg-gray-300 border-gray-400"
                              }`}
                            ></div>

                            {/* Line only between steps, not after last circle */}
                            {idx < 2 && (
                              <div
                                className={`flex-1 h-[2px] ${
                                  otpSent && step === 0
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center mb-[40px] mt-[37px]">
                      <Image
                        src="/images/check_circle.png"
                        width={75}
                        height={75}
                        alt="arrow"
                        className=" mb-2"
                      />
                      <div className="">
                        <span className="text-[16px] font-[16px] text-black">
                          Verified successfully
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-3 mt-[27.55px] fixed bottom-[57.92px]">
                        <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px] mx-auto rounded-[8px] w-[153.74px] h-[45px]">
                          Cancel
                        </Button>
                        <Button
                          onClick={() => setOtpSent(true)}
                          className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] mx-auto rounded-[8px] w-[172.27px] h-[45px]"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Enter new mobile Number */}
        <div className="hidden">
          <div className="flex justify-center pt-[13px]">
            <Drawer>
              <DrawerTrigger className="w-full">
                <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
                  Edit Profile
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] h-[359px]">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col">
                    {/* Stepper Line */}
                    <div className="flex justify-center items-center mt-[15px] mb-5">
                      <div className="flex items-center w-[324px] h-[11px]">
                        {[0, 1, 2].map((step, idx) => (
                          <React.Fragment key={idx}>
                            {/* Step circle */}
                            <div
                              className={`w-2 h-2 rounded-full border-2 ${
                                step === 0 || (otpSent && step <= 1)
                                  ? "bg-green-500 border-green-500"
                                  : "bg-gray-300 border-gray-400"
                              }`}
                            ></div>

                            {/* Line only between steps, not after last circle */}
                            {idx < 2 && (
                              <div
                                className={`flex-1 h-[2px] ${
                                  otpSent && step === 0
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* OTP Section */}
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-[16px] font-[600] text-black mb-[16.49px]">
                        Enter New Mobile Number
                      </span>

                      <div className="flex items-center bg-white border rounded-[7.26px]  w-[338px] h-[39px]">
                        <Input
                          id="mobile"
                          type="text"
                          placeholder="Enter new mobile no."
                          value={mobile}
                          // onChange={handleInputChange}
                          onChange={(e) => handleInputChange(e, setMobile1)}
                          className="bg-white border rounded-[7.26px] text-[12px] text-black font-500 placeholder:text-[12px] placeholder:text-[#000000] placeholder:font-[500]  py-3 px-4 w-full h-[39px]"
                          maxLength={10}
                          inputMode="numeric"
                          pattern="\d*"
                        />
                      </div>

                      <div className="mt-[20px] mb-[31.19px]">
                        <div className="flex flex-col justify-center items-center">
                          <span className="text-[12px] font-[500] text-gray-400 pb-1">
                            Enter OTP
                          </span>
                        </div>
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          className="gap-2 "
                        >
                          <InputOTPGroup className="flex gap-3  border-[#776EA5]">
                            <InputOTPSlot
                              index={0}
                              className="rounded-[9.23px] h-[45px] w-[45px]"
                            />
                            <InputOTPSlot
                              index={1}
                              className="rounded-[9.23px] h-[45px] w-[45px]"
                            />
                            <InputOTPSlot
                              index={2}
                              className="rounded-[9.23px] h-[45px] w-[45px]"
                            />
                            <InputOTPSlot
                              index={3}
                              className="rounded-[9.23px] h-[45px] w-[45px]"
                            />
                            <InputOTPSlot
                              index={4}
                              className="rounded-[9.23px] h-[45px] w-[45px]"
                            />
                            <InputOTPSlot
                              index={5}
                              className="rounded-[9.23px] h-[45px] w-[45px]"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <div className="flex justify-between items-center gap-3  fixed bottom-[50px]">
                        <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] w-[163.34px] h-[45px]">
                          Cancel
                        </Button>
                        <Button
                          onClick={() => setOtpSent(true)}
                          className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px]  rounded-[8px] w-[163.34px] h-[45px]"
                        >
                          Get OTP
                        </Button>
                      </div>
                      {/* <div className="flex flex-col relative left-50 top-12">
                    <div className="text-[12px] font-[500] text-gray-500">Resend OTP in 2:00</div>
                  </div> */}
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center ">
        {/* <span className="text-[10px] font-[500] text-black mr-1">Powered by</span> */}
        <Image src="/images/ekyamm.png" width={114} height={24} alt="ekyamm" />
        <div className="flex justify-center items-center mb-[26px]">
          <span className="text-[12px] font-[500] text-gray-500 mr-1">
            Powered by
          </span>
          <Image
            src="/images/chat_icon.png"
            width={67}
            height={26}
            alt="chat"
            className="mt-1"
          />
        </div>
      </div>
      {showCounsellorProfile ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Profile
              setShowCounsellorProfile={setShowCounsellorProfile}
              setShowCertifications={setShowCertifications}
              setShowClientTestimonials={setShowClientTestimonials}
              doc={patient?.practitionerTagged}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Patient_Profile;