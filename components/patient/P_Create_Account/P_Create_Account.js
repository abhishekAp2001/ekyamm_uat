"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { whatsappUrl } from "@/lib/constants";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { customEncodeString, encryptData, getStorage, sanitizeInput, setStorage } from "@/lib/utils";

const P_Create_Account = ({ type }) => {
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
  });
  const [formErrors, setFormErrors] = useState({
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    verificationToken: "",
  });

  const steps = [
    "Mobile Verification",
    "Create Password",
    "Add Touch ID",
    "Create Profile",
  ];
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(formData);
      if (!validateForm()) return;

      setFormLoader(true);
      try {
        const encodedPassword = customEncodeString(formData.password);
        const encryptedPassword = encryptData(encodedPassword);
        const response = await customAxios.post(`v2/cp/user/signin`, {
          verificationToken: verifiedUser?.verificationToken,
          password: encryptedPassword,
          mobileNumber: formData.mobileNumber,
          countryCode: "🇮🇳 +91",
          mobileVerified: true,
        });

        if (response?.data?.success) {
          const { userId, token, userType, status } = response.data.data;
          setCookie(
            "patientSessionData",
            JSON.stringify({ userId, token, userType, status })
          );
          setStorage(
            "patientSessionData",
            { userId, token, userType, status },
          )
          showSuccessToast(response?.data?.data?.message || "Account created successfully!");
          router.push(`/patient/${type}/details`);
        } else {
          showErrorToast(response?.data?.error?.message || "Sign-in failed");
        }
      } catch (err) {
        if(err?.status == 500) return showErrorToast("Something Went Wrong !!!")
        console.log(err);
        setCookie("patientSessionData", JSON.stringify({}));
        
        showErrorToast(
          err?.response?.data?.error?.message || "Error during sign-in"
        );
      } finally {
        setFormLoader(false);
      }
    },
    [formData]
  );

  useEffect(() => {
    // const verifiedUserCookie = getCookie("verifiedUserData");
    const verifiedUserCookie = getStorage("verifiedUserData");
    if (!verifiedUserCookie) {
      router.push(`/patient/${type}/create`);
      return;
    }
    const verifiedUserData = verifiedUserCookie
    setVerifiedUser(verifiedUserData);

    // const patientCookie = getCookie("patientLoginDetail");
    const patientCookie = getStorage("patientLoginDetail");
    if (!patientCookie) {
      router.push(`/patient/${type}/create`);
      return;
    }
    const patientData = patientCookie
    setPatientData(patientData);
    console.log(
      "channelPartnerData?.verificationToken",
      channelPartnerData?.verificationToken
    );
    setFormData((prev) => ({
      ...prev,
      mobileNumber: sanitizeInput(patientData?.primaryMobileNumber),
    }));

    const verifyChannelPartner = async (username) => {
      setLoading(true);
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: type,
        });

        if (response?.data?.success === true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setStorage("channelPartnerData", response?.data?.data);
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
        if(err?.status == 500) return showErrorToast("Something Went Wrong !!!")
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
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col justify-evenly items-center px-[16px] max-w-[576px] mx-auto">
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
        {/* slider */}
        <div className="flex flex-col items-center justify-center w-[294px]">
          <div className="relative flex justify-between w-full max-w-xl items-center">
            {/* Base line */}
            <div className="absolute top-1 left-[39px] right-[39px] h-1 bg-[#9B9B9B] z-0 rounded"></div>

            {/* Progress line */}
            <div
              className="absolute top-1 left-[39px] right-[39px] h-1 bg-green-500 z-10 rounded transition-all duration-500 w-fit"
              style={{
                width: `${(current / (steps.length - 1)) * 80}%`,
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
                index <= current
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
                  <Input
                    type="text"
                    disabled={true}
                    value={formData?.mobileNumber}
                    onBlur={handleInputBlur}
                    placeholder="Enter Registered Mobile Number"
                    className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
                  />
                  <Image
                    src="/images/green_check.png"
                    width={20}
                    height={20}
                    className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                    alt="check"
                  />
                </div>
                {formErrors.mobileNumber && (
                  <p id="mobile-error" className="mt-1 text-xs text-red-500">
                    {formErrors.mobileNumber}
                  </p>
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
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px] cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px] cursor-pointer cursor-pointer"
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
                    onPaste={(e) => e.preventDefault()} 
                  />

                  {showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px] cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-[14.67px] absolute top-2 right-[14.83px] cursor-pointer"
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
                      formData.password.trim() !== formData.confirmPassword.trim()

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

export default P_Create_Account;
