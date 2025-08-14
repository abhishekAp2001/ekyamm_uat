"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "../../ui/button";
import PR_Header from "../PR_Header/PR_Header";
import Footer_bar from "../../Footer_bar/Footer_bar";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";
import Select from "react-select";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Loader2, Loader2Icon, MapPin } from "lucide-react";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { Baseurl } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";
import OTPInput from "react-otp-input";
import { customEncodeString, encryptData, formatTime, getStorage, setStorage } from "@/lib/utils";
polyfillCountryFlagEmojis();

const Patient_Pays_Registration = ({ type }) => {
  const axios = axiosInstance();
  const router = useRouter();
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpSendStatus, setOtpSendStatus] = useState(false);
  const [errors, setErrors] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(false);
  const [emailOtpSendStatus, setEmailOtpSendStatus] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailResendTimer, setEmailResendTimer] = useState(120);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [isResendEmailDisabled, setIsResendEmailDisabled] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [encryptedOtp, setEncryptedOtp] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    primaryMobileNumber: "",
    countryCode_primary: "🇮🇳 +91",
    sessionCreditCount: "",
    sessionPrice: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    primaryMobileNumber: false,
    countryCode_primary: false,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.countryCode_primary &&
      isMobileValid(formData.primaryMobileNumber)
    );
  };

  const countryOptions = useMemo(
    () =>
      countryList.map((country) => ({
        value: `${country.flag} ${country.code}`,
        label: `${country.flag} ${country.code}`,
        name: country.name,
      })),
    [countryList]
  );

  const getCountryList = async () => {
    try {
      const response = await axios.get(`v2/country?search=${countrySearch}`);
      if (response?.data?.success === true) {
        setCountryList(response?.data?.data);
      }
    } catch (error) {
      // console.log("error", error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(
          error?.response?.data?.error?.message || "Something Went Wrong"
        );
      }
    }
  };

  useEffect(() => {
    getCountryList();
  }, []);

  useEffect(() => {
    // const cookieData = getCookie("channelPartnerData");
    const cookieData = getStorage("channelPartnerData");
    if (cookieData) {
      try {
        const parsedData = cookieData;
        setChannelPartnerData(parsedData);
      } catch (error) {
        setChannelPartnerData(null);
      }
    } else {
      setChannelPartnerData(null);
      router.push(`/channel-partner/${type}/patient-pay-landing`);
    }
  }, [type]);

  const verifyMobile = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/verify`,
        {
          channelPartnerUsername: type,
          mobileNumber: formData.primaryMobileNumber,
          type: "createProfile",
        }
      );
      if (!response?.data?.success) {
        setLoading(false);
        return false;
      }
      if (response?.data?.success) {
        setLoading(false);
        return true;
      }
    } catch (error) {
      setLoading(false);
      console.error("Error", error);
    }
  };

  const sendMobileOTP = async () => {
    try {
      setLoading(true);
      if (!isMobileValid(formData.primaryMobileNumber)) {
        setLoading(false);
        return;
      }
      const mobileValid = await verifyMobile();
      if (mobileValid) {
        setIsMobileNumberValid(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/otpGenerate`,
          {
            channelPartnerUsername: type,
            mobile: formData.primaryMobileNumber,
            type: "cpPatientPaySignupOTP",
            firstName: formData.firstName,
            lastName: formData.lastName,
          }
        );
        if (response?.data?.success) {
          setLoading(false);
          setOtpSendStatus(true);
          setResendTimer(120);
          setIsResendDisabled(true);
          setOtp("");
          showSuccessToast(`OTP sent to your verified mobile number.`);
        }
      }
      if (!mobileValid) {
        setLoading(false);
        setIsMobileNumberValid(false);
        showErrorToast("Mobile number is already registered.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error", error);
    }
  };

  const validateMobileOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/otpValidate`,
        {
          mobile: formData.primaryMobileNumber,
          otp: otp,
          type: "cpPatientPaySignupOTP",
        }
      );
      if (response?.data?.success) {
        // setCookie("patientLoginDetail", {
        //   primaryMobileNumber: formData.primaryMobileNumber,
        //   mobileVerified: true,
        //   email: formData.email,
        //   country_code: formData.countryCode_primary,
        //   firstName: formData?.firstName,
        //   lastName: formData?.lastName,
        // });
        setStorage("patientLoginDetail", {
          primaryMobileNumber: formData.primaryMobileNumber,
          mobileVerified: true,
          email: formData.email,
          country_code: formData.countryCode_primary,
          firstName: formData?.firstName,
          lastName: formData?.lastName,
        });
        setOtpVerified(true);
        setOtpSendStatus(false);
        setOtp("");
        setLoading(false);
        showSuccessToast("OTP verified successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error", error);
    }
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

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/verify`,
        {
          channelPartnerUsername: type,
          email: formData.email,
          type: "createProfile",
        }
      );
      if (!response?.data?.success) {
        setEmailLoading(false);
        return false;
      }
      if (response?.data?.success) {
        setEmailLoading(false);
        return true;
      }
    } catch (error) {
      setEmailLoading(false);
      console.error("Error", error);
    }
  };

  const sendEmailOTP = async () => {
    try {
      setEmailLoading(true);
      if (!isEmailValid(formData.email)) {
        showErrorToast("Enter a valid email");
        setEmailLoading(false);
        return;
      }
      const emailValid = await verifyEmail();
      if (emailValid) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/otpGenerate`,
          {
            channelPartnerUsername: type,
            email: formData.email,
            type: "cpPatientPaySignupOTP",
            firstName: formData.firstName,
            lastName: formData.lastName,
          }
        );
        if (response?.data?.success) {
          setEmailLoading(false);
          setEmailOtpSendStatus(true);
          setEmailResendTimer(120);
          setIsResendEmailDisabled(true);
          setEmailOtp("");
          setEncryptedOtp(response?.data?.data?.encryptedOtp)
          console.log("encrypt",response?.data?.data?.encryptedOtp)
          showSuccessToast(`OTP sent to your verified email.`);
        }
      }
      if (!emailValid) {
        setEmailLoading(false);
        showErrorToast("email is already registered.");
      }
    } catch (error) {
      showErrorToast("Something went wrong, please try again.");
      setEmailLoading(false);
      console.error("Error", error);
    }
  };

  const validateEmailOTP = async () => {
    try {
      setEmailLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/otpValidate`,
        {
          email: formData.email,
          otp: emailOtp,
          type: "cpPatientPaySignupOTP",
          encryptedOtp: encryptedOtp,
        }
      );
      if (response?.data?.success) {
        setEmailOtpVerified(true);
        setEmailOtpSendStatus(false);
        setEmailOtp("");
        setEmailLoading(false);
        showSuccessToast("OTP verified successfully");
      }
    } catch (error) {
      setEmailLoading(false);
      console.error("Error", error);
    }
  };
  useEffect(() => {
    let timer;
    if (emailOtpSendStatus && emailResendTimer > 0) {
      timer = setInterval(() => {
        setEmailResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (emailResendTimer === 0) {
      setIsResendEmailDisabled(false);
    }
    return () => clearInterval(timer);
  }, [emailOtpSendStatus, emailResendTimer]);
  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
        <div className="flex flex-col justify-center items-center pt-6">
        <strong className="text-[20px] text-[#776EA5] font-semibold">
              {channelPartnerData?.clinicName || "Greetings Hospital"}
            </strong>
        <div className="flex justify-center items-center gap-[2px]">
          <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
            <MapPin color="white" className="w-[12.15px] h-[12.15px]" /></div>
          <span className="text-sm text-[#776EA5] font-medium">
            {channelPartnerData?.area}
          </span>
        </div>
        </div>
        <div className="h-full pt-[4%] lg:pt-[4%] pb-[20%] lg:pb-[12%]  overflow-auto px-[16px]">
          <div className="bg-[#FFFFFFB2] rounded-[12px] p-5 mt-[25px] relative">
            <div>
              <Label className="text-[15px] text-gray-500 mb-[7.59px]">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter First Name"
                className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 font-semibold placeholder:font-medium py-3 px-4 h-[39px]"
              />
            </div>
            {touched.firstName && !formData.firstName && (
              <span className="text-red-500 text-sm mt-1 block">
                First name is required
              </span>
            )}
            <div>
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  disabled={!formData.firstName}
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  onBlur={() => handleBlur("lastName")}
                  type="text"
                  placeholder="Enter Last Name"
                  className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 font-semibold placeholder:font-medium py-3 px-4 h-[39px]"
                />
              </div>
              {touched.lastName && !formData.lastName && (
                <span className="text-red-500 text-sm mt-1 block">
                  Last name is required
                </span>
              )}
            </div>

            <div>
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
                Email Address
              </Label>
              <div className="flex items-center relative gap-3">
                <Input
                  disabled={!formData.lastName || emailOtpVerified}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value.toLowerCase(),
                    })
                  }
                  onBlur={() => handleBlur("email")}
                  type="text"
                  placeholder="Enter Email Address"
                  className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-3 px-4 h-[39px]"
                />
                {emailOtpVerified ? (
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
              </div>
              {touched.email &&
                formData.email &&
                !isEmailValid(formData.email) && (
                  <span className="text-red-500 text-sm mt-1 block">
                    must be a valid email
                  </span>
                )}
              {emailOtpSendStatus && !emailOtpVerified ? (
                <>
                  <div className="my-[15px]">
                    <div className="text-[12px] text-gray-500 font-medium text-left mb-1 relative ">
                      Enter OTP
                    </div>
                    <div className="relative flex items-center">
                      <OTPInput
                        type="text"
                        inputType="number"
                        value={emailOtp}
                        onChange={setEmailOtp}
                        numInputs={6}
                        renderSeparator={<span className="w-2" />}
                        renderInput={(props) => (
                          <input
                            {...props}
                            type={showEmailOtp ? "text" : "password"}
                            className="border-[1.54px] border-[#776EA5] rounded-[9.23px] text-[16px] text-[#776EA5] text-center focus:outline-none focus:ring-2 focus:ring-[#776EA5] otp-input "
                          />
                        )}
                        containerStyle="flex justify-between gap-[2px] items-center w-[90%]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowEmailOtp(!showEmailOtp)}
                        aria-label={showEmailOtp ? "Hide OTP" : "Show OTP"}
                      >
                        {showEmailOtp ? (
                          <Eye
                            width={20}
                            height={20}
                            className="h-4 w-4 text-[#776EA5] cursor-pointer"
                          />
                        ) : (
                          <EyeOff
                            width={20}
                            height={20}
                            className="h-4 w-4 text-[#776EA5] cursor-pointer"
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {emailOtpSendStatus && !emailOtpVerified ? (
                <div className="flex gap-3 mt-5">
                  <Button
                    type="button"
                    className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] rounded-[8px] flex-1 h-[45px]"
                    onClick={isResendEmailDisabled ? null : sendEmailOTP}
                  >
                    Resend OTP
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white rounded-[8px] flex-1 h-[45px]"
                    disabled={emailOtp.length !== 6}
                    onClick={() => {
                      validateEmailOTP();
                    }}
                  >
                    Verify OTP
                  </Button>
                </div>
              ) : (
                !emailOtpVerified &&
                formData.email &&
                isEmailValid(formData.email) && (
                  <Button
                    type="button"
                    className="w-full mt-5 h-[45px] bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center"
                    onClick={() => {
                      sendEmailOTP();
                    }}
                  >
                    {emailLoading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Get OTP"
                    )}
                  </Button>
                )
              )}
              {emailOtpSendStatus && !emailOtpVerified && (
                <div className="text-xs text-gray-500 font-medium text-center mt-2">
                  {emailResendTimer > 0 ? (
                    `Resend OTP in ${formatTime(emailResendTimer)}`
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
                Primary Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center relative gap-3">
                {/* Custom Country Dropdown */}
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.countryCode_primary
                  )}
                  onChange={(selectedOption) => {
                    const newCountryCode = selectedOption
                      ? selectedOption.value
                      : "🇮🇳 +91";
                    setFormData((prev) => ({
                      ...prev,
                      countryCode_primary: newCountryCode,
                    }));
                    setTouched((prev) => ({
                      ...prev,
                      countryCode_primary: true,
                    }));
                  }}
                  isDisabled={!formData.lastName}
                  className="w-[100px] border-none focus:border-none hover:border-none hover:outline-none shadow-none"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "7.26px 0 0 7.26px",
                      borderRightWidth: 0,
                      height: "39px",
                      minHeight: "39px",
                      width: "max-content",
                      backgroundColor: formData.lastName ? "#fff" : "#fff",
                    }),
                    menu: (base) => ({ ...base, width: "200px" }),
                  }}
                  formatOptionLabel={(option, { context }) =>
                    context === "menu"
                      ? `${option.label} - ${option.name}`
                      : option.label
                  }
                  menuPlacement="top"
                />

                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.primaryMobileNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryMobileNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    })
                  }
                  onBlur={() => handleBlur("primaryMobileNumber")}
                  disabled={!formData.lastName || otpVerified}
                  placeholder="Enter Mobile Number"
                  className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-2 px-4 h-[38px] w-full"
                />
                {otpVerified ? (
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
              </div>
              {touched.primaryMobileNumber &&
                formData.primaryMobileNumber &&
                !isMobileValid(formData.primaryMobileNumber) && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Must be 10 digits
                  </span>
                )}
              {touched.primaryMobileNumber && !formData.primaryMobileNumber && (
                <span className="text-red-500 text-sm mt-1 block">
                  Mobile number is required
                </span>
              )}
              {otpSendStatus && !otpVerified ? (
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
                            className="h-4 w-4 text-[#776EA5] cursor-pointer"
                          />
                        ) : (
                          <EyeOff
                            width={20}
                            height={20}
                            className="h-4 w-4 text-[#776EA5] cursor-pointer"
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {otpSendStatus && !otpVerified ? (
                <div className="flex gap-3 mt-5">
                  <Button
                    type="button"
                    className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] rounded-[8px] flex-1 h-[45px]"
                    onClick={isResendDisabled ? null : sendMobileOTP}
                  >
                    Resend OTP
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white rounded-[8px] flex-1 h-[45px]"
                    disabled={otp.length !== 6}
                    onClick={() => {
                      validateMobileOTP();
                    }}
                  >
                    Verify OTP
                  </Button>
                </div>
              ) : (
                !otpVerified &&
                formData.primaryMobileNumber &&
                isMobileValid(formData.primaryMobileNumber) && (
                  <Button
                    type="button"
                    className="w-full mt-5 h-[45px] bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center"
                    onClick={() => {
                      sendMobileOTP();
                    }}
                  >
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Get OTP"
                    )}
                  </Button>
                )
              )}
              {otpSendStatus && !otpVerified && (
                <div className="text-xs text-gray-500 font-medium text-center mt-2">
                  {resendTimer > 0 ? (
                    `Resend OTP in ${formatTime(resendTimer)}`
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
            {(
  // Case 1: No email entered → show when mobile OTP verified
  (!formData.email && otpVerified) ||

  // Case 2: Email entered but OTP never sent → show when mobile OTP verified
  (formData.email && !emailOtpSendStatus && otpVerified) ||

  // Case 3: Email entered, OTP sent → show only when both verified
  (formData.email && emailOtpSendStatus && otpVerified && emailOtpVerified)
) && (
  <div className="flex justify-between items-center mt-[24.69px] gap-3">
    <Button
      type="submit"
      className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center w-full h-[45px]"
      onClick={() => {
        router.push(
          `/channel-partner/${type}/patient-pay-registration/password`
        );
      }}
    >
      Create Password
    </Button>
  </div>
)}

          </div>

          <div className="flex justify-center items-center gap-[18px] mt-[25px] px-1 ml-[31px] mr-[31px]">
            <Link
              disabled={loading}
              href={`/patient/login`}
              className="text-[15px] "
            >
              <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[141px] h-[45px]">
                Already a User ?
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex flex-col justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
          <Footer_bar />
        </div>
      </div>
    </>
  );
};

export default Patient_Pays_Registration;
