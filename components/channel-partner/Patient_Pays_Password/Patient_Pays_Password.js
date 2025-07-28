"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Baseurl, whatsappUrl } from "@/lib/constants";
import { Eye, EyeOff, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { customEncodeString, encryptData, sanitizeInput } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import axios from "axios";

const Patient_Pays_Password = ({ type }) => {
  const customAxios = axiosInstance();
  const router = useRouter();

  const [formLoader, setFormLoader] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState({});

  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    verificationToken: "",
    email: "",
    countryCode: "",
    firstName: "",
    lastName: "",
  });
  const [formErrors, setFormErrors] = useState({
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    verificationToken: "",
  });
  const passwordRegex =
    /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,}$/;
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      verificationToken: "",
    };
    let isValid = true;

    if (!formData.mobileNumber.match(/^\d{10}$/)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = `You must use a password that is at least 8 characters long ,
with one lowercase letter, one uppercase letter, one number,
one symbol, and no spaces.`;
      isValid = false;
      console.log("in2");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
      console.log("in3");
    }

    if (!formData.verificationToken) {
      newErrors.verificationToken = "Verification token is required";
      isValid = false;
      console.log("in4");
    }
    // console.log("verifiedUser",verifiedUser?.verificationToken  );
    console.log("formData", formData);

    setFormErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleInputBlur = useCallback(
    (e) => {
      const { name } = e.target;
      validateForm(); // Validate on blur for immediate feedback
    },
    [validateForm]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient/invite`,
        {
          channelPartnerUsername: type,
          patientDetails: {
            countryCode_primary: formData?.countryCode,
            primaryMobileNumber: formData?.mobileNumber,

            firstName: formData?.firstName,
            lastName: formData?.lastName,
            mobileVerified: true,
            emailVerified: formData?.email ? true : false,
            password: formData?.password,
          },
        }
      );
      if (response?.data?.success) {
        const patientSessionData = {
          userId: response?.data?.data?.patient?._id,
          token: response?.data?.data?.token,
          userType: response?.data?.data?.userType,
          status: response?.data?.data?.status,
        };
        setCookie("patientSessionData", JSON.stringify(patientSessionData));
        router.push(`/patient/${type}/details`);
      } else {
        return;
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    const patientCookie = getCookie("patientLoginDetail");
    if (!patientCookie) {
      router.push(`/patient/${type}/create`);
      return;
    }
    const patientData = JSON.parse(patientCookie);
    setPatientData(patientData);
    console.log(
      "channelPartnerData?.verificationToken",
      channelPartnerData?.verificationToken
    );
    setFormData((prev) => ({
      ...prev,
      mobileNumber: sanitizeInput(patientData?.primaryMobileNumber),
      email: sanitizeInput(patientData?.email),
      countryCode: sanitizeInput(patientData?.country_code),
      firstName: sanitizeInput(patientData?.firstName),
      lastName: sanitizeInput(patientData?.lastName),
    }));

    const verifyChannelPartner = async (username) => {
      setLoading(true);
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: type,
        });

        if (response?.data?.success === true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setChannelPartnerData(response.data.data);
          setFormData((prev) => ({
            ...prev,
            verificationToken: sanitizeInput(
              response.data.data?.verificationToken
            ),
          }));
        } else {
          showErrorToast(
            response?.data?.error?.message || "Verification failed"
          );
        }
      } catch (err) {
        showErrorToast(
          err?.response?.data?.error?.message ||
            "An error occurred while verifying"
        );
      } finally {
        setLoading(false);
      }
    };
    verifyChannelPartner(type);
  }, [type]);

    return (
        <>
            <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col justify-between items-center px-[16px] max-w-[576px] mx-auto">
         
                {formLoader && (
                    <div
                        className="fixed inset-0 bg-[#000000b8] bg-opacity-20 flex items-center justify-center z-50 transition-opacity duration-300"
                        aria-live="polite"
                        aria-label="Loading"
                    >
                        <div className="bg-none p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <Image
                                src="/loader.png"
                                width={48}
                                height={48}
                                alt="Loading"
                                className="animate-spin"
                            />
                            <p className="mt-2 text-lg font-semibold text-white">
                                Validating...
                            </p>
                        </div>
                    </div>
                )}
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
        <div className="flex flex-col justify-center items-center w-full">
          <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl py-6 px-6  mx-4 text-center w-full">
            <strong className="text-[16px] text-black font-[600] text-center">
              Create Password
            </strong>
            <div className="pt-6">
              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
                noValidate
              >
                <div className="relative">
                  <div className="flex justify-between items-center mb-[7.59px]">
                    <Label className="block text-left text-[12px] text-black">
                      Login Mobile Number:
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 text-[12px] font-medium">
                        Verified
                      </span>
                      <Image
                        src="/images/green_check.png"
                        width={14}
                        height={14}
                        className="w-[14px] h-[14px]"
                        alt="check"
                      />
                    </div>
                  </div>

                  <Input
                    type="text"
                    disabled={true}
                    value={formData?.mobileNumber}
                    onBlur={handleInputBlur}
                    placeholder="Enter Registered Mobile Number"
                    className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
                  />
                </div>

                {formErrors.mobileNumber && (
                  <p id="mobile-error" className="mt-1 text-xs text-red-500">
                    {formErrors.mobileNumber}
                  </p>
                )}
                {patientData?.email ? (
                  <div className="relative">
                    <div className="flex justify-between items-center mb-[7.59px]">
                      <Label className="block text-left text-[12px] text-black">
                        Login Email ID:
                      </Label>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 text-[12px] font-medium">
                          Verified
                        </span>
                        <Image
                          src="/images/green_check.png"
                          width={14}
                          height={14}
                          className="w-[14px] h-[14px]"
                          alt="check"
                        />
                      </div>
                    </div>

                    <Input
                      type="text"
                      disabled={true}
                      value={formData?.email}
                      onBlur={handleInputBlur}
                      placeholder="Enter Registered Mobile Number"
                      className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="relative mb-0">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="Create password"
                    className={`bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px] mt-5 ${
                      formErrors.password ? " border border-red-500" : ""
                    }`}
                    aria-invalid={!!formErrors.password}
                    aria-describedby={
                      formErrors.password ? "password-error" : undefined
                    }
                  />
                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px]"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px]"
                    />
                  )}
                </div>
                {formErrors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-xs text-red-500 text-left"
                  >
                    {formErrors.password}
                  </p>
                )}
                <div className="relative mb-0">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="Re-enter password"
                    className={`bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px] mt-5 ${
                      formErrors.confirmPassword ? " border border-red-500" : ""
                    }`}
                    aria-invalid={!!formErrors.confirmPassword}
                    aria-describedby={
                      formErrors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px]"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px]"
                    />
                  )}
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 text-left">
                    {formErrors.confirmPassword}
                  </p>
                )}
                <div className="flex justify-between items-center mt-[24.69px]  gap-3">
                  <Button
                    type="submit"
                    // disabled={loading}
                    disabled={
                      loading ||
                      !formData.password.trim() ||
                      !formData.confirmPassword.trim() ||
                      formData.password.trim() !==
                        formData.confirmPassword.trim()
                    }
                    className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-full h-[45px]"
                  >
                    {loading ? (
                      <Loader2
                        className="w-5 h-5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </form>
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

export default Patient_Pays_Password;
