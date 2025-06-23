"use client";

import React, { useEffect, useState, useMemo } from "react";
import CP_Header from "@/components/CP_Header/CP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CP_buttons from "@/components/CP_buttons/CP_buttons";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Select from "react-select";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import Emergency_Header from "../Emergency_Header/Emergency_Header";
import { Button } from "../ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Baseurl } from "@/lib/constants";
polyfillCountryFlagEmojis();

const Emergency_Details = ({ type }) => {
  const router = useRouter();
  const customAxios = axiosInstance();
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emergencyContact: false,
    relation: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode_primary: "🇮🇳 +91",
    primaryMobileNumber: "",
    countryCode_whatsapp: "🇮🇳 +91",
    whatsappNumber: "",
  });

  const [touched, setTouched] = useState({
    relation: false,
    firstName: false,
    lastName: false,
    email: false,
    primaryMobileNumber: false,
    whatsappNumber: false,
  });

  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [countryList, setCountryList] = useState([]);

  const relations = [
    "Father",
    "Mother",
    "Husband",
    "Wife",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
  ];

  // Validation functions
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  // isEmailValid(formData.email) &&
  // isMobileValid(formData.whatsappNumber)
  const isFormValid = () =>
    formData.relation &&
    formData.firstName &&
    formData.lastName &&
    isMobileValid(formData.primaryMobileNumber);
  // Fetch country list
  const getCountryList = async () => {
    try {
      const response = await customAxios.get("v2/country");
      if (response?.data?.success) {
        setCountryList(response.data.data);
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.error?.message || "Error fetching countries"
      );
    }
  };

  // Load data from cookie on mount
  useEffect(() => {
    const savedData = getCookie("cp_doctor_details");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        countryCode_primary: parsedData.countryCode_primary || "🇮🇳 +91",
        countryCode_whatsapp: parsedData.countryCode_whatsapp || "🇮🇳 +91",
      }));
      setTouched({
        relation: !!parsedData.relation,
        firstName: !!parsedData.firstName,
        lastName: !!parsedData.lastName,
        email: !!parsedData.email,
        primaryMobileNumber: !!parsedData.primaryMobileNumber,
        whatsappNumber: !!parsedData.whatsappNumber,
      });
    }
    getCountryList();
  }, []);

  // Handle text input changes
  const handleTextInputChange = (e, field) => {
    const value =
      field === "email" ? e.target.value.toLowerCase() : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle mobile number input changes
  const handleInputChange = (e, field) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (sameAsMobile && field === "primaryMobileNumber") {
        newData.whatsappNumber = value;
        newData.countryCode_whatsapp = prev.countryCode_primary;
      }
      return newData;
    });
  };

  // Handle blur for validation feedback
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const userDataCookie = getCookie("userData");
    let token;
    if (userDataCookie) {
      try {
        token = JSON.parse(userDataCookie).token;
      } catch (error) {
        console.error("Error parsing userData cookie:", error);
      }
    }

    if (!token) {
      showErrorToast("Authentication required. Please log in.");
      router.push("/create");
      return;
    }

    const payload = {
      familyMember: {
        emergencyContact: formData.emergencyContact,
        relation: formData.relation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode_primary: formData.countryCode_primary,
        primaryMobileNumber: formData.primaryMobileNumber,
        countryCode_whatsapp: formData.countryCode_whatsapp,
        whatsappNumber: formData.whatsappNumber,
      },
    };

    router.push(`/patient/dashboard`);
    try {
      // const response = await axios.post(
      //   Baseurl + "/v2/cp/patient/familyMember",
      //   payload,
      //   {
      //     headers: { accesstoken: token },
      //   }
      // );
      // if (response.data.success) {
      //   showSuccessToast("Emergency member added successfully");
      //   setCookie("completeUserData", response.data.data);
      //   if (formData.emergencyContact) {
      //     router.push(`/patient/${type}/family-details`);
      //   } else {
      //     router.push(`/patient/${type}/emergency-details`);
      //   }
      // } else {
      //   showErrorToast(response.data.message || "Failed to add family member");
      // }
    } catch (error) {
      showErrorToast(err.response?.data?.error?.message || "Submission failed");
    } finally {
      setLoading(false);
    }

    console.log("payload", payload);
  };

  // Country options for dropdown
  const countryOptions = useMemo(
    () =>
      countryList.map((country) => ({
        value: `${country.flag} ${country.code}`,
        label: `${country.flag} ${country.code}`,
        name: country.name,
      })),
    [countryList]
  );

  useEffect(() => {
    const verifyChannelPartner = async (username) => {
      setLoading(true);
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: type,
        });

        if (response?.data?.success === true) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setChannelPartnerData(response.data.data);
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
    <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col max-w-[576px] mx-auto">
      <Emergency_Header />
      <div className="min-h-screen pt-[10%] pb-[20%] lg:pb-[14%] overflow-auto px-[17px]">
        <div className="mt-3 lg:mt-0 bg-[#FFFFFF80] rounded-[12px] p-4 px-3">
          <strong className="text-[15px] text-black font-semibold">
            Emergency Contact Details
          </strong>

          {/* Relation */}
          <div>
            <Label className="text-[15px] text-gray-500 font-medium mb-2 mt-5">
              Relation *
            </Label>
            <UISelect
              value={formData.relation}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, relation: value }))
              }
            >
              <SelectTrigger className="w-full bg-white rounded-[7.26px] text-[15px] text-black font-medium h-[39px] px-3">
                {formData.relation || (
                  <span className="text-gray-400">Choose Relation</span>
                )}
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </UISelect>
            {touched.relation && !formData.relation && (
              <span className="text-red-500 text-sm mt-1 block">
                Relation is required
              </span>
            )}
          </div>

          {/* First Name */}
          <div>
            <Label
              htmlFor="firstName"
              className={`text-[15px] mb-2 mt-[22px] ${
                formData.relation ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleTextInputChange(e, "firstName")}
              onBlur={() => handleBlur("firstName")}
              disabled={!formData.relation}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                formData.relation ? "bg-white" : "bg-[#ffffff10]"
              }`}
            />
            {touched.firstName && !formData.firstName && (
              <span className="text-red-500 text-sm mt-1 block">
                First name is required
              </span>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label
              htmlFor="lastName"
              className={`text-[15px] mb-2 mt-[22px] ${
                formData.firstName ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleTextInputChange(e, "lastName")}
              onBlur={() => handleBlur("lastName")}
              disabled={!formData.firstName}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                formData.firstName ? "bg-white" : "bg-[#ffffff10]"
              }`}
            />
            {touched.lastName && !formData.lastName && (
              <span className="text-red-500 text-sm mt-1 block">
                Last name is required
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className={`text-[15px] mb-2 mt-[22px] ${
                formData.lastName ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleTextInputChange(e, "email")}
              onBlur={() => handleBlur("email")}
              disabled={!formData.lastName}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                formData.lastName ? "bg-white" : "bg-[#ffffff10]"
              }`}
            />

            {touched.email &&
              formData.email &&
              !isEmailValid(formData.email) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid email
                </span>
              )}
          </div>

          {/* Primary Mobile Number */}
          <div className="mt-[22px]">
            <Label
              htmlFor="primaryMobileNumber"
              className={`text-[15px] mb-2 ${
                !formData.lastName ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              Primary Mobile Number *
            </Label>
            <div className="flex items-center h-[39px]">
              <Select
                options={countryOptions}
                value={countryOptions.find(
                  (option) => option.value === formData.countryCode_primary
                )}
                onChange={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryCode_primary: option ? option.value : "🇮🇳 +91",
                    ...(sameAsMobile && {
                      countryCode_whatsapp: option ? option.value : "🇮🇳 +91",
                    }),
                  }))
                }
                isDisabled={!formData.lastName}
                className="w-fit"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                    backgroundColor: formData.lastName ? "#fff" : "#f6f5fd",
                  }),
                  menu: (base) => ({ ...base, width: "200px" }),
                }}
              />
              <Input
                id="primaryMobileNumber"
                type="text"
                inputMode="numeric"
                placeholder="Enter primary mobile no."
                value={formData.primaryMobileNumber}
                onChange={(e) => handleInputChange(e, "primaryMobileNumber")}
                onBlur={() => handleBlur("primaryMobileNumber")}
                disabled={!formData.lastName}
                className={`rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                  formData.lastName ? "bg-white" : "bg-[#ffffff10]"
                }`}
                maxLength={10}
              />
            </div>
            {touched.primaryMobileNumber && !formData.primaryMobileNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                Mobile number is required
              </span>
            )}
            {touched.primaryMobileNumber &&
              formData.primaryMobileNumber &&
              !isMobileValid(formData.primaryMobileNumber) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Must be 10 digits
                </span>
              )}
          </div>

          {/* WhatsApp Number */}
          <div className="mt-[22px]">
            <div className="flex items-center">
              <Label
                htmlFor="whatsappNumber"
                className={`text-[15px] w-[55%] mb-2 ${
                  isMobileValid(formData.primaryMobileNumber)
                    ? "text-gray-500"
                    : "text-[#00000040]"
                }`}
              >
                WhatsApp Number
              </Label>
              <div className="flex gap-[6px] items-center w-[45%]">
                <Checkbox
                  checked={sameAsMobile}
                  onCheckedChange={(checked) => {
                    setSameAsMobile(checked);
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        whatsappNumber: prev.primaryMobileNumber,
                        countryCode_whatsapp: prev.countryCode_primary,
                      }));
                    }
                  }}
                  disabled={!isMobileValid(formData.primaryMobileNumber)}
                  className="w-4 h-4 border border-[#776EA5] rounded-[1.8px]"
                />
                <label className="text-[12px] text-gray-500 font-medium">
                  Same as Mobile Number
                </label>
              </div>
            </div>
            <div className="flex items-center h-[39px]">
              <Select
                options={countryOptions}
                value={countryOptions.find(
                  (option) => option.value === formData.countryCode_whatsapp
                )}
                onChange={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryCode_whatsapp: option ? option.value : "🇮🇳 +91",
                  }))
                }
                isDisabled={
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                }
                className="w-fit"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                    backgroundColor:
                      !sameAsMobile &&
                      isMobileValid(formData.primaryMobileNumber)
                        ? "#fff"
                        : "#f6f5fd",
                  }),
                  menu: (base) => ({ ...base, width: "200px" }),
                }}
              />
              <Input
                id="whatsappNumber"
                type="text"
                inputMode="numeric"
                placeholder="Enter whatsapp no."
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange(e, "whatsappNumber")}
                onBlur={() => handleBlur("whatsappNumber")}
                disabled={
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                }
                className={`rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                    ? "bg-[#ffffff10]"
                    : "bg-white"
                }`}
                maxLength={10}
              />
            </div>

            {touched.whatsappNumber &&
              formData.whatsappNumber &&
              !isMobileValid(formData.whatsappNumber) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Must be 10 digits
                </span>
              )}
          </div>

          {/* Emergency Contact */}
          {/* <div className="flex gap-[6px] items-center mt-[22px]">
            <Checkbox
              checked={formData.emergencyContact === true}
              disabled={!isFormValid()}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  emergencyContact: checked ? true : false,
                }))
              }
              className="w-4 h-4 border border-[#776EA5] rounded-[2px]"
            />
            <label className="text-[14px] text-[#776EA5] font-bold">
              Make this as an Emergency Contact
            </label>
          </div> */}
        </div>
        <div className="bg-[#e8e6f7] flex justify-between items-center gap-3 fixed bottom-0 px-[17px] pb-[18px] left-0 right-0 max-w-[576px] m-auto">
          <Button
            className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
            onClick={() => {
              router.push(`/patient/${type}/family-details`);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!isFormValid() || loading}
            onClick={handleSubmit}
            className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px] flex-nowrap whitespace-normal"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              "Select Counsellor"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Emergency_Details;
