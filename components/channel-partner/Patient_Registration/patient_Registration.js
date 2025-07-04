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
import { Loader2Icon, MapPin } from "lucide-react";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
polyfillCountryFlagEmojis()

const Patient_Registration = ({ type }) => {
  const axios = axiosInstance();
  const router = useRouter();
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState("");

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

  const handlePatientHistoryClick = async () => {
    setLoading(true);
    if (!type) {
      showErrorToast("Username must be provided.");
    }

    try {
      const response = await axios.post(`v2/cp/patient/invite`, {
        channelPartnerUsername: type,
        patientDetails: formData,
      });

      if (response?.data?.success === true) {
        const patientData = {...response?.data?.data?.patient,patientType:2}
        setCookie("invitePatientInfo", JSON.stringify(patientData));
        router.push(`/channel-partner/${type}/patient-history`);
      } else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong."
        );
      }
    } catch (err) {
      // console.log(err);
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while inviting"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountryList();
  }, []);

  useEffect(() => {
    const cookieData = getCookie("channelPartnerData");
    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData);
        setChannelPartnerData(parsedData);
      } catch (error) {
        setChannelPartnerData(null);
      }
    } else {
      setChannelPartnerData(null);
      router.push(`/channel-partner/${type}`);
    }
  }, [type]);

  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
        <PR_Header type={type} patientType={2} text="New Patient Registration"  />
        <div className="h-full pt-[15%] lg:pt-[10%] pb-[20%] lg:pb-[12%]  overflow-auto px-[16px]">
          <div className="w-full h-[25px] text-[#776EA5] font-semibold text-[20px] leading-[25px] mb-2 text-center">
            {channelPartnerData?.clinicName || "Greetings Hospital"}
          </div>
          <div className="flex items-center justify-center gap-1">
           <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
              <MapPin color="white" className="w-[12.15px] h-[12.15px]"/></div>
              <span className="text-sm text-[#776EA5] font-medium">
                {channelPartnerData?.area}
              </span>
              </div>
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
              <Input
                disabled={!formData.lastName}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value.toLowerCase() })
                }
                onBlur={() => handleBlur("email")}
                type="text"
                placeholder="Enter Email Address"
                className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-3 px-4 h-[39px]"
              />
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
                       backgroundColor:formData.lastName ?"#fff" : "#fff"
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
                      primaryMobileNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  
                  onBlur={() => handleBlur("primaryMobileNumber")}
                  disabled={!formData.lastName}
                  placeholder="Enter Mobile Number"
                  className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-2 px-4 h-[38px] w-full"
                />
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
            </div>
          </div>

          <div className="flex justify-center items-center gap-[18px] mt-[25px] px-1 ml-[31px] mr-[31px]">
             <Link
                disabled={loading}
                href={`/channel-partner/${type}/existing-patient`}
                className="text-[15px] "
              >
            <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[141px] h-[45px]">
                Existing Patient
            </Button>
              </Link>
            <Button
              disabled={!isFormValid() || loading}
              type="button"
              className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[141px] h-[45px] "
              onClick={handlePatientHistoryClick}
            >
              {/* <Link
                href={`/channel-partner/${type}/patient-history`}
                className="text-[15px] "
              > */}
              {loading ? (<Loader2Icon className="animate-spin" />) : '+ Patient History'}
              
              {/* </Link> */}
            </Button>
          </div>
        </div>
        <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex flex-col justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
          <Footer_bar />
        </div>
      </div>
    </>
  );
};

export default Patient_Registration;
