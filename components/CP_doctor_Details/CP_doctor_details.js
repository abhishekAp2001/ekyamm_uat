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
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { showErrorToast } from "@/lib/toast";
polyfillCountryFlagEmojis();

const CP_doctor_details = () => {
  const router = useRouter();
  const axios = axiosInstance();

  const [formData, setFormData] = useState({
    doNotDisplay: false,
    title: "Dr.",
    firstName: "",
    lastName: "",
    email: "",
    primaryMobileNumber: "",
    whatsappNumber: "",
    emergencyNumber: "",
    countryCode_primary: "🇮🇳 +91",
    countryCode_whatsapp: "🇮🇳 +91",
    countryCode_emergency: "🇮🇳 +91",
  });

  const [touched, setTouched] = useState({
    title: false,
    firstName: false,
    lastName: false,
    email: false,
    primaryMobileNumber: false,
    whatsappNumber: false,
    emergencyNumber: false,
  });

  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");

  // Validation functions
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  const isFormValid = () =>
    formData.title &&
    formData.firstName &&
    formData.lastName &&
    isEmailValid(formData.email) &&
    isMobileValid(formData.primaryMobileNumber) &&
    isMobileValid(formData.whatsappNumber) &&
    isMobileValid(formData.emergencyNumber);

  // Fetch country list on component mount
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
        showErrorToast(error?.response?.data?.error?.message || "Something Went Wrong");
      }
    }
  };

  // Load form data from cookie on component mount
  useEffect(() => {
    const savedData = getCookie("cp_doctor_details");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        let rawFirstName = parsedData.firstName;
        const titles = ["Dr.", "Prof.", "Mr.", "Ms."];
        for (const title of titles) {
          if (rawFirstName.startsWith(`${title} `)) {
            rawFirstName = rawFirstName.replace(`${title} `, "").trim();
            parsedData.title = title;
            break;
          }
        }
        parsedData.firstName = rawFirstName;
        setFormData({
          ...parsedData,
          countryCode_primary: parsedData.countryCode_primary || "🇮🇳 +91",
          countryCode_whatsapp: parsedData.countryCode_whatsapp || "🇮🇳 +91",
          countryCode_emergency: parsedData.countryCode_emergency || "🇮🇳 +91",
        });
        if (parsedData.primaryMobileNumber === parsedData.whatsappNumber) {
          setSameAsMobile(true);
        }
        setTouched({
          title: !!parsedData.title,
          firstName: !!parsedData.firstName,
          lastName: !!parsedData.lastName,
          email: !!parsedData.email,
          primaryMobileNumber: !!parsedData.primaryMobileNumber,
          whatsappNumber: !!parsedData.whatsappNumber,
          emergencyNumber: !!parsedData.emergencyNumber,
        });
      } catch (error) {
        console.error("Error parsing cp_doctor_details cookie:", error);
      }
    }
    getCountryList();
  }, []);

  // Handle input change for mobile numbers (limit to 10 digits)
  const handleInputChange = (e, field) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      if (sameAsMobile && field === "primaryMobileNumber") {
        newFormData.whatsappNumber = value;
        newFormData.countryCode_whatsapp = prev.countryCode_primary;
      }
      return newFormData;
    });
  };

  // Handle text input change for firstName and lastName
  const handleTextInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Handle title change
  const handleTitleChange = (value) => {
    setFormData((prev) => ({ ...prev, title: value }));
    handleBlur("title");
  };

  // Handle blur for input fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle save and continue
  const handleSave = () => {
    if (isFormValid()) {
      const saveData = {
        ...formData,
        firstName: formData.title
          ? `${formData.title} ${formData.firstName}`
          : formData.firstName,
      };
      setCookie("cp_doctor_details", saveData);
      router.push("/sales/cp_billing_details");
    } else {
      setTouched({
        title: true,
        firstName: true,
        lastName: true,
        email: true,
        primaryMobileNumber: true,
        whatsappNumber: true,
        emergencyNumber: true,
      });
      showErrorToast("Please fill all required fields correctly");
    }
  };

  // Country options for Select
  const countryOptions = useMemo(() =>
    countryList.map((country) => ({
      value: `${country.flag} ${country.code}`,
      label: `${country.flag} ${country.code}`,
      name: country.name,
    })), [countryList]);

  return (
    <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col">
      <CP_Header />
      <div className="min-h-screen pt-[10%] pb-[20%] overflow-auto px-[17px] bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5]">
        <div className="mt-3 lg:mt-0 bg-[#FFFFFF80] rounded-[12px] p-4 px-3">
          <strong className="text-[15px] text-black font-semibold">
            Doctor’s Details
          </strong>
          <div className="flex gap-[6px] items-center mt-[8.8px]">
            <Checkbox
              checked={formData.doNotDisplay}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, doNotDisplay: checked }))
              }
              className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1"
            />
            <label className="text-[12px] text-[#776EA5] font-bold">
              Do Not Display Contact Details on Profile
            </label>
          </div>
          <div>
            <Label
              className="text-[15px] text-gray-500 font-medium mb-2 mt-5"
            >
              Title & First Name *
            </Label>
            <div className="flex gap-2 items-center">
              <UISelect
                value={formData.title}
                onValueChange={handleTitleChange}
              >
                <SelectTrigger
                  className="w-[69px] bg-white rounded-[7.26px] text-[15px] text-black font-medium h-[39px] px-3"
                >
                  <SelectValue placeholder="Dr." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                </SelectContent>
              </UISelect>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleTextInputChange(e, "firstName")}
                onBlur={() => handleBlur("firstName")}
                disabled={!formData.title}
                className={`flex-1 rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-[#00000040] py-3 px-4 h-[39px] ${
                  formData.title
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff10] placeholder:text-[#00000040]"
                }`}
              />
            </div>
            {touched.title && !formData.title && (
              <span className="text-red-500 text-sm mt-1 block">
                Title is required
              </span>
            )}
            {touched.firstName && !formData.firstName && (
              <span className="text-red-500 text-sm mt-1 block">
                First name is required
              </span>
            )}
          </div>
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
              disabled={!formData.firstName}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                formData.firstName
                  ? "bg-white placeholder:text-[#00000040]"
                  : "bg-[#ffffff10] placeholder:text-[#00000040]"
              }`}
            />
            {touched.lastName && !formData.lastName && (
              <span className="text-red-500 text-sm mt-1 block">
                Last Name is required
              </span>
            )}
          </div>
          <div>
            <Label
              htmlFor="email"
              className={`text-[15px] mb-2 mt-[22px] ${
                formData.lastName ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              Dr’s Primary Email Address *
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
                formData.lastName
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff10] placeholder:text-[#00000040]"
              }`}
            />
            {touched.email && !formData.email && (
              <span className="text-red-500 text-sm mt-1 block">
                Email is required
              </span>
            )}
            {touched.email &&
              formData.email &&
              !isEmailValid(formData.email) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid email
                </span>
              )}
          </div>
          <div className="mt-[22px]">
            <Label
              htmlFor="primaryMobileNumber"
              className={`text-[15px] mb-2 ${
                isEmailValid(formData.email)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              Dr&apos;s Primary Mobile Number *
            </Label>
            <div className="flex items-center h-[39px]">
              <Select
                options={countryOptions}
                value={countryOptions.find(option => option.value === formData.countryCode_primary)}
                onChange={(selectedOption) => {
                  const newCountryCode = selectedOption ? selectedOption.value : "🇮🇳 +91";
                  setFormData(prev => ({
                    ...prev,
                    countryCode_primary: newCountryCode,
                    ...(sameAsMobile && { countryCode_whatsapp: newCountryCode }),
                  }));
                }}
                isDisabled={!isEmailValid(formData.email)}
                className="w-[100px] " 
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                    backgroundColor:isEmailValid(formData.email) ?"#fff" : "#f6f5fd"
                  }),
                  menu: (base) => ({ ...base, width: "200px" }),
                }}
                formatOptionLabel={(option, { context }) =>
                  context === "menu" ? `${option.label} - ${option.name}` : option.label
                }
                menuPlacement="top"
              />
              <Input
                id="primaryMobileNumber"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter primary mobile no."
                value={formData.primaryMobileNumber}
                onChange={(e) => handleInputChange(e, "primaryMobileNumber")}
                onBlur={() => handleBlur("primaryMobileNumber")}
                disabled={!isEmailValid(formData.email)}
                className={`border rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                  isEmailValid(formData.email)
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff10] placeholder:text-[#00000040]"
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
                Dr&apos;s WhatsApp Number *
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
                      setTouched((prev) => ({
                        ...prev,
                        whatsappNumber: true,
                      }));
                    }
                  }}
                  disabled={!isMobileValid(formData.primaryMobileNumber)}
                  className={`w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1 ${
                  isMobileValid(formData.primaryMobileNumber)
                    ? "text-gray-500"
                    : "text-[#00000040]"
                }`}
                />
                <label className="text-[12px] text-gray-500 font-medium">
                  Same as Mobile Number
                </label>
              </div>
            </div>
            <div className="flex items-center h-[39px]">
              <Select
                options={countryOptions}
                value={countryOptions.find(option => option.value === formData.countryCode_whatsapp)}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    countryCode_whatsapp: selectedOption ? selectedOption.value : "🇮🇳 +91",
                  })
                }
                isDisabled={sameAsMobile || !isMobileValid(formData.primaryMobileNumber)}
                className="w-[100px]"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                    backgroundColor:sameAsMobile || isMobileValid(formData.primaryMobileNumber) ?"#fff" : "#f6f5fd"
                  }),
                  menu: (base) => ({ ...base, width: "200px" }),
                }}
                formatOptionLabel={(option, { context }) =>
                  context === "menu" ? `${option.label} - ${option.name}` : option.label
                }
                menuPlacement="top"
              />
              <Input
                id="whatsappNumber"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter whatsapp no."
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange(e, "whatsappNumber")}
                onBlur={() => handleBlur("whatsappNumber")}
                disabled={sameAsMobile || !isMobileValid(formData.primaryMobileNumber)}
                className={`border rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                    ? "bg-[#ffffff10] placeholder:text-[#00000040]"
                    : "bg-white placeholder:text-gray-500"
                }`}
                maxLength={10}
              />
            </div>
            {touched.whatsappNumber && !formData.whatsappNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                WhatsApp number is required
              </span>
            )}
            {touched.whatsappNumber &&
              formData.whatsappNumber &&
              !isMobileValid(formData.whatsappNumber) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Must be 10 digits
                </span>
              )}
          </div>
          <div className="mt-[22px]">
            <Label
              htmlFor="emergencyNumber"
              className={`text-[15px] mb-2 ${
                isMobileValid(formData.whatsappNumber)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              Dr&apos;s Emergency Number *
            </Label>
            <div className="flex items-center h-[39px]">
              <Select
                options={countryOptions}
                value={countryOptions.find(option => option.value === formData.countryCode_emergency)}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    countryCode_emergency: selectedOption ? selectedOption.value : "🇮🇳 +91",
                  })
                }
                isDisabled={!isMobileValid(formData.whatsappNumber)}
                className="w-[100px]"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                     backgroundColor:isMobileValid(formData.whatsappNumber) ?"#fff" : "#f6f5fd"
                  }),
                  menu: (base) => ({ ...base, width: "200px" }),
                }}
                formatOptionLabel={(option, { context }) =>
                  context === "menu" ? `${option.label} - ${option.name}` : option.label
                }
                menuPlacement="top"
              />
              <Input
                id="emergencyNumber"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter emergency no."
                value={formData.emergencyNumber}
                onChange={(e) => handleInputChange(e, "emergencyNumber")}
                onBlur={() => handleBlur("emergencyNumber")}
                disabled={!isMobileValid(formData.whatsappNumber)}
                className={`border rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                  isMobileValid(formData.whatsappNumber)
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff10] placeholder:text-[#00000040]"
                }`}
                maxLength={10}
              />
            </div>
            {touched.emergencyNumber && !formData.emergencyNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                Emergency number is required
              </span>
            )}
            {touched.emergencyNumber &&
              formData.emergencyNumber &&
              !isMobileValid(formData.emergencyNumber) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Must be 10 digits
                </span>
              )}
          </div>
        </div>
        <CP_buttons
          disabled={!isFormValid()}
          onSave={handleSave}
          buttonText={"Save & Continue"}
        />
      </div>
    </div>
  );
};

export default CP_doctor_details;
