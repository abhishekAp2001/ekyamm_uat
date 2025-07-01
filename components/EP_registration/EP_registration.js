"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "../ui/button";
import Footer_bar from "../Footer_bar/Footer_bar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { getCookie, setCookie } from "cookies-next";
import Select from "react-select";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Loader2Icon, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PR_Header from "../PR_Header/PR_Header";

// Custom debounce function
const customDebounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

polyfillCountryFlagEmojis();

const EP_registration = ({ type }) => {
  const router = useRouter();
  const customAxios = axiosInstance();
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Track API loading state
  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    primaryMobileNumber: "",
    countryCode_primary: "🇮🇳 +91",
    sessionCreditCount: "",
    sessionPrice: "",
    history: {
      updatedBy: {
        userId: "",
        userType: "",
      },
      details: "",
      updatedOn: "",
    },
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
      const response = await customAxios.get(`v2/country`);
      if (response?.data?.success === true) {
        setCountryList(response?.data?.data);
      }
    } catch (error) {
      // console.log("error", error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
      }
    }
  };

  const searchPatients = async (searchString) => {
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
      countryCode_primary: "🇮🇳 +91",
    }));
    if (searchString.length < 2) {
      setSearchUsers([]);
      return;
    }
    setLoading(true);
    try {
      const params = {
        channelPartnerUsername: type,
        searchString,
      };
      const response = await axios.get(
        `https://dev.ekyamm.com/v2/cp/patient/search`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: params,
        }
      );
      if (response?.data?.success === true) {
        setSearchUsers(response?.data?.data);
      } else {
        setSearchUsers([]);
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.error?.message || "Something Went Wrong"
      );
      setSearchUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (profile) => {
    setFormData({
      _id: profile?._id || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      primaryMobileNumber: profile.primaryMobileNumber || "",
      countryCode_primary: profile.countryCode_primary || "🇮🇳 +91",
      sessionCreditCount: profile.availableCredits?.toString() || "0",
      sessionPrice: "", // still not in the profile
      history: {
        updatedBy: {
          userId: profile.history?.updatedBy?.userId || "",
          userType: profile.history?.updatedBy?.userType || "",
        },
        details: profile.history?.details || "",
        updatedOn: profile.history?.updatedOn || "",
      },
    });
  };

  const handlePatientHistoryClick = async () => {
    setLoading(true);
    if (!type) {
      showErrorToast("Username must be provided.");
    }
    // console.log('formData',formData)
    //   return
    try {
      setCookie("invitePatientInfo", JSON.stringify({...formData,patientType:1}));
      router.push(`/channel-partner/${type}/patient-history`);
    } catch (err) {
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while inviting"
      );
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    customDebounce((value) => {
      searchPatients(value);
    }, 500),
    [type] // Dependency on 'type' ensures stability
  );

  const handleMobileNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      primaryMobileNumber: value,
    }));
    if (value.length >= 1) {
      debouncedSearch(value);
    } else {
      setSearchUsers([]);
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
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <PR_Header type={type} patientType={1} text="Existing Patient" />
      <div className="h-full pb-[28%] lg:pb-[14%] overflow-auto px-[17px]">
        <div className="w-full h-[25px] text-[#776EA5] font-semibold text-[20px] leading-[25px] mb-2 text-center">
          {channelPartnerData?.clinicName || "Greetings Hospital"}
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
            <MapPin color="white" className="w-[12.15px] h-[12.15px]" />
          </div>
          <span className="text-sm text-[#776EA5] font-medium">
            {channelPartnerData?.area}
          </span>
        </div>
        <div className="bg-[#FFFFFFB2] rounded-[12px] p-5 mt-[25px] relative">
          {/* Mobile number */}
          <div>
            <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px]">
              Primary Mobile Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center relative gap-3">
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
                className="w-[100px] border-none shadow-none"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
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
                onChange={handleMobileNumberChange}
                onBlur={() => handleBlur("primaryMobileNumber")}
                placeholder="Enter Mobile Number"
                className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-2 px-4 h-[39px] w-full"
                disabled={loading} // Disable input during search
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

          {/* First name */}
          <div className="mt-6">
            <Label className="text-[15px] text-gray-500 mb-[7.59px]">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter First Name"
              value={formData.firstName}
              disabled={true}
              className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-3 px-4 h-[39px]"
            />
          </div>

          {/* Last name */}
          <div className="mt-6">
            <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[5px]">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={formData.lastName}
              disabled={true}
              placeholder="Enter Last Name"
              className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 font-semibold py-3 px-4 h-[39px]"
            />
          </div>

          {/* Email address */}
          <div className="mt-6">
            <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[5px]">
              Email Address
            </Label>
            <Input
              type="text"
              value={formData.email.toLocaleLowerCase()}
              disabled={true}
              placeholder="Enter Email Address"
              className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-3 px-4 h-[39px]"
            />
          </div>

          {/* Profile Section */}
          {searchUsers.length > 0 && (
            <div className="absolute top-[26%] left-1/2 transform -translate-x-1/2 w-full h-[226px] rounded-[16px] bg-gradient-to-br from-[#DFDAFB] to-[#F9CCC5] backdrop-blur-[20px] shadow-[0_5px_20px_0_rgba(0,0,0,0.2)] px-4 py-[14px] overflow-auto">
              <div className="w-full h-[198px] flex flex-col gap-[12px]">
                {searchUsers.map((profile, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      // console.log('profil2e',profile)
                      handleUserClick(profile);
                      setSearchUsers([]);
                    }}
                    className="w-full h-[58px] bg-white/50 rounded-[12px] px-[12px] py-[8px] flex items-center justify-between gap-[118px]"
                  >
                    <div className="flex items-center gap-[12px]">
                      <Avatar>
                        <AvatarImage src={profile.image} />
                        <AvatarFallback>{` ${
                          profile.firstName
                            ? profile.firstName?.charAt(0).toUpperCase()
                            : ""
                        }${
                          profile.lastName
                            ? profile.lastName.charAt(0).toUpperCase()
                            : ""
                        }`}</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col justify-center gap-[5px]">
                        <Label className="text-sm text-black font-semibold leading-[16px]">
                          {`${profile.firstName} ${profile.lastName}`}
                        </Label>
                        <Label className="text-[11px] text-[#6D6A5D] font-medium leading-[14px]">
                          {profile.primaryMobileNumber}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center gap-[18px] mt-[25px] px-1 ml-[31px] mr-[31px]">
           <Link href={`/channel-partner/${type}/patient-registration`}>
          <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[141px] h-[45px]">
              New Patient
          </Button>
            </Link>
          <Button
            disabled={!isFormValid() || loading}
            type="button"
            className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[141px] h-[45px] "
            onClick={handlePatientHistoryClick}
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "+ Patient History"
            )}

            {/* </Link> */}
          </Button>
        </div>
      </div>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex flex-col justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
        <Footer_bar />
      </div>
    </div>
  );
};

export default EP_registration;
