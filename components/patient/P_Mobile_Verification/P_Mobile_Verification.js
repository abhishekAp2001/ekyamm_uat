"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { whatsappUrl } from "@/lib/constants";
import Link from "next/link";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import OTPInput from "react-otp-input";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { getCookie, setCookie } from "cookies-next";
import { formatTime, getStorage, setStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";

const P_Mobile_Verification = ({ type }) => {
  const customAxios = axiosInstance();
  const router = useRouter();

  const [otpSendStatus, setOtpSendStatus] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [formData, setFormData] = useState({
    primaryMobileNumber: "",
    mobileVerified: isMobileVerified,
  });
  const [errors, setErrors] = useState({ primaryMobileNumber: "", otp: "" });
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [verifiedUserData, setVerifiedUserData] = useState(null);
  const [resendTimer, setResendTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const steps = [
    "Mobile Verification",
    "Create Password",
    "Add Touch ID",
    "Create Profile",
  ];

  const handleMobileNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      primaryMobileNumber: value,
      mobileVerified: isMobileVerified,
    }));
    if (value) {
      setErrors((prev) => ({ ...prev, primaryMobileNumber: "" }));
    }
  };

  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  const isFormValid = () => {
    return isMobileValid(formData.primaryMobileNumber && isMobileVerified);
  };

  const handleSendOtp = async () => {
    if (!formData.primaryMobileNumber) {
      setErrors((prev) => ({
        ...prev,
        primaryMobileNumber: "Enter mobile number",
      }));
      return;
    }
    if (!isMobileValid(formData.primaryMobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        primaryMobileNumber: "Please enter a valid 10-digit mobile number",
      }));
      return;
    }

    setLoading(true);
    try {
      if (await verifyMobile()) {
        if (await sendMobileOtp()) {
          setResendTimer(120);
          setIsResendDisabled(true);
          setOtp("");
          showSuccessToast("OTP has been shared to your mobile number.");
        }
        setOtpSendStatus(true);
      }

      setErrors((prev) => ({ ...prev, primaryMobileNumber: "", otp: "" }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        primaryMobileNumber: error.message || "Error sending OTP",
      }));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      showErrorToast("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // if (selectedMethod === "mobile") {

      // }
      if (await validateMobileOtp(otp)) {
        redirectAfterOtpValidate(type);
        return;
      } else {
        return;
      }
    } catch (error) {
      console.log("error", error);
      showErrorToast("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateMobileOtp = async (otp) => {
    setLoading(true);

    try {
      const mobileNumber =
        formData.primaryMobileNumber?.trim() || null;
      let countryCode = "+91";
      if (channelPartnerData.countryCode_primary) {
        const countryCodeParts =
          channelPartnerData.countryCode_primary.split("+");
        if (countryCodeParts.length > 1 && countryCodeParts[1]) {
          countryCode = `+${countryCodeParts[1].trim()}`;
        } else {
          console.warn(
            `Invalid country code format: ${channelPartnerData.countryCode_primary}. Falling back to ${defaultCountryCode}`
          );
        }
      }

      // const result = await axios.get(apiUrl, { params });
      const response = await customAxios.post(`/v2/cp/mobile/otpValidate`, {
        mobile: mobileNumber,
        otp: otp,
      });
      // if (result.data.result === "success")
      if (response?.data?.success) {
        return true;
      } else {
        // console.log(result);
        showErrorToast("Invalid Otp");
      }
      return false;
    } catch (err) {
      console.log("err", err);

      showErrorToast(
        err.response?.data?.error?.message ||
          "An error occurred while generating OTP"
      );
    } finally {
      setLoading(false);
    }
    return false;
  };

  function redirectAfterOtpValidate(type) {
    showSuccessToast("Verified successfully.");
    // setCookie("patientLoginDetail", JSON.stringify(formData));
    setStorage("patientLoginDetail", formData);
    setTimeout(() => {
      router.push(`/patient/${type}/verified_successfully`);
    }, 100);
  }

  const verifyMobile = async () => {
    // setIsMobileVerified(true);
    // return true;
    setLoading(true);

    try {
      const response = await customAxios.post(`v2/cp/mobile/verify`, {
        channelPartnerUsername: type,
        mobileNumber: formData.primaryMobileNumber,
        countryCode: "🇮🇳 +91",
        type: "createProfile",
      });

      if (response?.data?.success) {
        setIsMobileVerified(true);
        setFormData((prev) => ({
          ...prev,
          mobileVerified: true,
        }));
        // setCookie("verifiedUserData", JSON.stringify(response?.data?.data));
        setStorage("verifiedUserData", response?.data?.data);
        setVerifiedUserData(response?.data?.data?.verificationToken)
        return true;
      } else {
        setIsMobileVerified(false);
        showErrorToast(`${response?.data?.error?.message}`);
      }
    } catch (err) {
      showErrorToast(
        err.response?.data?.error?.message ||
          "An error occurred while generating OTP"
      );
    } finally {
      setLoading(false);
    }
    return false;
  };

  const sendMobileOtp = async () => {
    setLoading(true);

    try {
      const mobileNumber =
        formData?.primaryMobileNumber?.trim() || null;
      let countryCode = "+91";
      if (channelPartnerData.countryCode_primary) {
        const countryCodeParts =
          channelPartnerData.countryCode_primary.split("+");
        if (countryCodeParts.length > 1 && countryCodeParts[1]) {
          countryCode = `+${countryCodeParts[1].trim()}`;
        } else {
          console.warn(
            `Invalid country code format: ${channelPartnerData.countryCode_primary}. Falling back to ${defaultCountryCode}`
          );
        }
      }
      // const verifiedPatientToken = JSON.parse(getCookie("verifiedUserData") || "{}");
      const verifiedPatientToken = getStorage("verifiedUserData") || {};
      const response = await customAxios.post(`v2/cp/mobile/otpGenerate`, {
        mobile: mobileNumber,
        type: "cpPatientRegisterOTP",
        verificationToken: verifiedPatientToken.verificationToken,
        channelPartnerUsername: type
      });

      if (response?.data?.success) {
        return true;
      } else {
        showErrorToast(response?.data?.data?.message);
      }
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "An error occurred while generating OTP"
      );
    } finally {
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    const verifyChannelPartner = async (username) => {
      setLoading(true);
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: type,
        });

        if (response?.data?.success == true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setStorage("channelPartnerData", response.data.data);
          setChannelPartnerData(response.data.data);
          if(response?.data?.data?.billingType == "patientPays"){
            router.push('/patient/login')
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
      } finally {
        setLoading(false);
      }
    };
    verifyChannelPartner(type); // Replace 'apollo' with dynamic username if needed
  }, [type]);

  useEffect(() => {
    let timer;
    if (otpSendStatus && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [otpSendStatus, resendTimer]);

  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col justify-evenly items-center px-[16px] max-w-[576px] mx-auto">
        {/* slider */}
        <div className="flex flex-col items-center justify-center w-[294px]">
          <div className="relative flex justify-between w-full max-w-xl items-center">
            {/* Base line */}
            <div className="absolute top-1 left-[39px] right-[39px] h-1 bg-[#9B9B9B] z-0 rounded"></div>

            {/* Progress line */}
            <div
              className="absolute top-1 left-[39px] right-[39px] h-1 bg-green-500 z-10 rounded transition-all duration-500 w-fit"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 80}%`,
              }}
            ></div>

            {/* Steps */}
            {steps.map((label, index) => (
              <div
                key={index}
                className="flex flex-col items-center z-20 w-1/4 cursor-pointer group px-3"
                onClick={() => setCurrent(index)}
              >
                <div
                  className={`w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 
              ${
                index <= currentStep
                  ? "bg-green-500 border-green-500"
                  : "bg-[#9B9B9B] border-gray-400"
              } 
              group-hover:scale-110`}
                ></div>
                <div className="text-[8px] text-center mt-2 text-gray-700 whitespace-nowrap">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-[47.28px] px-6  mx-4 text-center w-full">
            <strong className="text-[16px] text-black font-[600] text-center">
              Create Profile
            </strong>
            <div className="pt-6">
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.primaryMobileNumber}
                  onChange={handleMobileNumberChange}
                  disabled={loading}
                  placeholder="Enter Registered Mobile Number / Email Address"
                  className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
                />
                {isMobileVerified ? (
                  <Image
                    src="/images/green_check.png"
                    width={20}
                    height={20}
                    className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                    alt="check"
                  />
                ) : (
                  <></>
                )}
                {errors?.primaryMobileNumber && (
                  <span className="text-start text-red-500 text-sm mt-1 block">
                    {errors?.primaryMobileNumber}
                  </span>
                )}
              </div>
              {/* otp */}
              {otpSendStatus ? (
                <>
                  <div className="my-[15px]">
                    <div className="text-[12px] text-gray-500 font-medium text-left mb-1 relative ">
                      Enter OTP 
                    </div>

                    <div className="relative flex items-center">
                      <OTPInput
                        type="text"
                        inputType="number"
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span className="w-2" />}
                        renderInput={(props) => (
                          <input
                            {...props}
                            type={showOtp ? "text" : "password"}
                            className="border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-[#776EA5] text-center focus:outline-none focus:ring-2 focus:ring-[#776EA5] otp-input "
                          />
                        )}
                        containerStyle="flex justify-between gap-[2px] items-center w-[90%]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowOtp(!showOtp)}
                        aria-label={showOtp ? "Hide OTP" : "Show OTP"}
                      >
                        {showOtp ? (
                          <Eye
                            width={20}
                            height={20}
                            className="h-4 w-4 text-[#776EA5]"
                          />
                        ) : (
                          <EyeOff
                            width={20}
                            height={20}
                            className="h-4 w-4 text-[#776EA5]"
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="flex flex-col mt-[24.69px]  gap-2">
                <div className="flex justify-between items-center ">
                  <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
                  onClick={() => router.push(`/patient/login`)}>
                    Already a User?
                  </Button>
                  <Button
                    type="button"
                    disabled={
                      loading ||
                      (otpSendStatus ? otp.length !== 6
                        : formData.primaryMobileNumber.length !== 10) ||
                      !isFormValid
                    }
                    onClick={otpSendStatus ? verifyOtp : handleSendOtp}
                    className="w-[48%] h-[45px] bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : otpSendStatus ? (
                      "Verify OTP"
                    ) : (
                      "Get OTP"
                    )}
                  </Button>
                </div>
                <div className="flex justify-center ml-37">
                  {otpSendStatus && (
                    <div className="text-xs text-gray-500 font-medium">
                      {resendTimer > 0 ? (
                        `Resend OTP in ${formatTime(resendTimer)}`
                      ) : (
                        <span
                          className="text-[#1DA563] cursor-pointer"
                          onClick={isResendDisabled ? null : handleSendOtp}
                        >
                          Resend OTP
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-1 items-center mt-[54px]">
            <span className="text-[10px] text-gray-500 font-medium">
              Copyright © {new Date().getFullYear()}
            </span>
            <Image
              src="/images/ekyamm.png"
              width={100}
              height={49}
              className="w-[106px] mix-blend-multiply"
              alt="ekyamm"
            />
          </div>
        </div>

        {/* footer */}
        <div className="">
          <div className="flex flex-col justify-center items-center gap-[4.75px] fixed bottom-0 p-[20px] left-0 right-0">
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-gray-500 font-medium">
                Any technical support
              </span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/chat_icon.png"
                  width={54}
                  height={49}
                  className="w-[54px]"
                  alt="ekyamm"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default P_Mobile_Verification;
