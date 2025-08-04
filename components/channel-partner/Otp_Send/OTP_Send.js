"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Patient_Header from "../../patient/Patient_Header/Patient_Header";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { formatTime, getStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import axiosInstance from "@/lib/axiosInstance";
import { Eye, EyeOff, Loader2Icon, MapPin } from "lucide-react";
import axios from "axios";
import { whatsappUrl } from "@/lib/constants";
import OTPInput from "react-otp-input";
 
const OTP_Send = ({ type }) => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSendStatus, setOtpSendStatus] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const router = useRouter();
  const customAxios = axiosInstance();
 
  const sendOtp = async () => {
    if (isLoading) return;
 
    setLoading(true);
    try {
      if (selectedMethod === "mobile") {
        if (await sendMobileOtp()) {
          setOtpSendStatus(true);
          setResendTimer(120);
          setIsResendDisabled(true);
          setOtp("");
          showSuccessToast(`OTP sent to your verified mobile number.`);
        }
      } else {
        if (await sendEmailOtp()) {
          setOtpSendStatus(true);
          setResendTimer(120);
          setIsResendDisabled(true);
          setOtp("");
          showSuccessToast(`OTP sent to your verified email.`);
        }
      }
    } catch (error) {
      showErrorToast("Failed to send OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
 
  function redirectAfterOtpValidate(type) {
    showSuccessToast("OTP verified successfully!");
    setTimeout(() => {
      router.push(`/channel-partner/${type}/verified_successfully`);
    }, 100);
  }
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      showErrorToast("Please enter a valid 6-digit OTP");
      return;
    }
 
    setLoading(true);
    try {
      if (selectedMethod === "mobile") {
        if (await validateMobileOtp(otp)) {
          redirectAfterOtpValidate(type);
          return;
        } else {
          // showErrorToast("Invalid OTP. Please try again.");
          return;
        }
      } else if (selectedMethod === "email") {
        if (await validateEmailOtp(otp)) {
          redirectAfterOtpValidate(type);
        } else {
          // showErrorToast("Invalid OTP. Please try again.");
          return;
        }
      }
    } catch (error) {
      showErrorToast("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const changeOtpMethod = (method) => {
    setSelectedMethod(method);
    setOtpSendStatus(false);
    setOtp("");
    setResendTimer(120);
    setIsResendDisabled(false);
  };
 
  const sendEmailOtp = async () => {
    setLoading(true);
 
    try {
      const response = await customAxios.post(`v2/cp/email/otpGenerate`, {
        email: channelPartnerData?.email,
        verificationToken: channelPartnerData?.verificationToken,
        type: "cpLoginOTP",
      });
 
      if (response?.data?.success === true) {
        return true;
      } else {
        showErrorToast(response?.data?.error?.message || "Otp Not Sent.");
      }
    } catch (err) {
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while sending."
      );
    } finally {
      setLoading(false);
    }
    return false;
  };
 
  const sendMobileOtp = async () => {
    setLoading(true);
 
    try {
      const apiUrl = "http://india.smscloudhub.com/generateOtp.jsp";
      const mobileNumber =
        channelPartnerData.primaryMobileNumber?.trim() || null;
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
      const params = {
        userid: "Radicle",
        key: "7f0853aec2XX", // Note: In production, store this in .env
        mobileno: `${countryCode}${mobileNumber}`,
        timetoalive: 200,
        message:
          "Your Ekyamm registration verification code is {otp}. Please enter this code on your app to complete your registration.",
        senderid: "EKYAMM",
        accusage: 1,
        entityid: "1701171698144140417",
        tempid: "1707171767456458609",
      };
      // const result = await axios.get(apiUrl, { params });
      const response = await customAxios.post(`v2/cp/mobile/otpGenerate`, {
        mobile: mobileNumber,
        type: "cpLoginOTP",
        verificationToken: channelPartnerData?.verificationToken,
        channelPartnerUsername: type
      });
      // if (result.data.result === "success")
      if (response?.data?.success) {
        return true;
      } else {
        showErrorToast(`Failed to generate OTP`);
      }
    } catch (err) {
      showErrorToast(
        err.response?.data?.reason || "An error occurred while generating OTP"
      );
    } finally {
      setLoading(false);
    }
    return false;
  };
 
  const validateMobileOtp = async (otp) => {
    setLoading(true);
 
    try {
      const apiUrl = "http://india.smscloudhub.com/validateOtpApi.jsp";
 
      const mobileNumber =
        channelPartnerData.primaryMobileNumber?.trim() || null;
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
 
      const params = {
        mobileno: `${countryCode}${mobileNumber}`,
        otp: otp,
      };
 
      // const result = await axios.get(apiUrl, { params });
      const response = await customAxios.post(`v2/cp/mobile/otpValidate`, {
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
      showErrorToast(
        err.response?.data?.reason || "An error occurred while Verifying OTP"
      );
    } finally {
      setLoading(false);
    }
    return false;
  };
 
  const validateEmailOtp = async (otp) => {
    setLoading(true);
 
    try {
      const response = await customAxios.post(`v2/cp/email/otpValidate`, {
        email: channelPartnerData?.email,
        otp: otp,
      });
 
      if (response?.data?.success === true) {
        // showErrorToast("Verified successfully");
        return true;
      } else {
        showErrorToast(response?.data?.error?.message || "Invalid otp");
      }
    } catch (err) {
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while verifying"
      );
    } finally {
      setLoading(false);
    }
    return false;
  };
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
 
  useEffect(() => {
    // const cookieData = getCookie("channelPartnerData");
    const cookieData = getStorage("channelPartnerData");
    if (cookieData) {
      try {
        const parsedData = cookieData
        setChannelPartnerData(parsedData);
      } catch (error) {
        setChannelPartnerData(null);
      }
    } else {
      setChannelPartnerData(null);
      router.push(`/channel-partner/${type}`);
    }
    // showSuccessToast(`OTP sent to your verified mobile number.`);
  }, [type]);
 
  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col px-3">
        <Patient_Header
          to={`/channel-partner/${type}`}
          title="Add New Patient"
        />
        <div className="h-full flex flex-col justify-between items-center my-[34%] md:my-[8%]">
          <div className="flex flex-col items-center w-full">
            <strong className="text-[20px] text-[#776EA5] font-semibold">
              {channelPartnerData?.clinicName || "Greetings Hospital"}
            </strong>
            <div className="flex items-center justify-center gap-1">
              <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
                <MapPin color="white" className="w-[12.15px] h-[12.15px]" />
              </div>
              <span className="text-sm text-[#776EA5] font-medium">
                {channelPartnerData?.area}
              </span>
            </div>
            </div>
 

            <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-[17px] text-center w-full  px-5">
              <strong className="text-[15px] text-black font-[600] text-center">
                {selectedMethod === "mobile" || selectedMethod === "email"
                    ? "Send OTP to"
                    : "Send OTP to Verified ID"}
               
              </strong>
              <div>
                <div className="flex justify-between items-center mt-[15px] gap-3">
                  <label className="w-[48%] h-[45px] cursor-pointer">
                    <input
                      type="radio"
                      name="auth"
                      value="email"
                      checked={selectedMethod === "email"}
                      onChange={() => changeOtpMethod("email")}
                      className="hidden"
                    />
                    <div
                      className={`border rounded-[8px] text-[15px] font-[600] flex items-center justify-center h-full py-[14.5px] transition-all duration-200 ${
                        selectedMethod === "email"
                          ? "bg-[#1DA563] text-white border-[#1DA563]"
                          : "bg-transparent text-[#CC627B] border-[#CC627B]"
                      }`}
                    >
                      Email
                    </div>
                  </label>
 
                  <label className="w-[48%] h-[45px] cursor-pointer">
                    <input
                      type="radio"
                      name="auth"
                      value="mobile"
                      checked={selectedMethod === "mobile"}
                      onChange={() => changeOtpMethod("mobile")}
                      className="hidden"
                    />
                    <div
                      className={`border rounded-[8px] text-[15px] font-[600] flex items-center justify-center h-full py-[14.5px] transition-all duration-200 ${
                        selectedMethod === "mobile"
                          ? "bg-[#1DA563] text-white border-[#1DA563]"
                          : "bg-transparent text-[#CC627B] border-[#CC627B]"
                      }`}
                    >
                      Mobile
                    </div>
                  </label>
                </div>
                {otpSendStatus ? (
                  <>
                    <div className="my-[15px]">
                      <div className="text-[12px] text-gray-500 font-medium text-left mb-1 relative ">
                      Enter OTP
                    </div>
                      <div className="relative flex items-center mt-2">
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
                <Button
                  onClick={otpSendStatus ? verifyOtp : sendOtp}
                  disabled={
                    isLoading ||
                    !selectedMethod ||
                    (otpSendStatus && (!otp || otp.length !== 6))
                  }
                  className="cursor-pointer bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white border py-[14.5px] rounded-[8px] flex items-center justify-center w-full h-[45px] mt-[15px]"
                >
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : otpSendStatus ? (
                    "Verify OTP"
                  ) : (
                    "Get OTP"
                  )}
                </Button>
              </div>
 
              {otpSendStatus && (
                <div className="text-xs text-gray-500 font-medium text-center mt-2">
                  {resendTimer > 0 ? (
                    `Resend OTP in ${formatTime(resendTimer)}`
                  ) : (
                    <span
                      className="text-[#1DA563] cursor-pointer"
                      onClick={isResendDisabled ? null : sendOtp}
                    >
                      Resend OTP
                    </span>
                  )}
                </div>
              )}
            </div>
 
        {/* footer */}
        <div className="flex flex-col justify-center items-center gap-[4.75px] pb-5 ">
          <div className="flex gap-1 items-center">
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
 
export default OTP_Send;
 
 