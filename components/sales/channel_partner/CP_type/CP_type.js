"use client";

import CP_Header from "@/components/sales/channel_partner/CP_Header/CP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import CP_buttons from "@/components/sales/channel_partner/CP_buttons/CP_buttons";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import Image from "next/image";
polyfillCountryFlagEmojis();

const CP_type = () => {
  const axios = axiosInstance();

  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    clinicName: "",
    userName: "",
    email: "",
    primaryMobileNumber: "",
    whatsappNumber: "",
    emergencyNumber: "",
    countryCode_primary: "🇮🇳 +91",
    countryCode_whatsapp: "🇮🇳 +91",
    countryCode_emergency: "🇮🇳 +91",
  });
  const [touched, setTouched] = useState({
    type: false,
    clinicName: false,
    userName: false,
    email: false,
    primaryMobileNumber: false,
    whatsappNumber: false,
    emergencyNumber: false,
  });
  const [cp_list, setCp_List] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(null);
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const router = useRouter();
  const [countrySearch, setCountrySearch] = useState("");

  // Load form data from cookie on component mount
  useEffect(() => {
    const savedData = getCookie("cp_type");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        if (parsedData.primaryMobileNumber === parsedData.whatsappNumber) {
          setSameAsMobile(true);
        }
        if (parsedData.userName) {
          setTouched((prev) => ({ ...prev, userName: true }));
          checkUserNameAvailability(parsedData.userName);
        }
      } catch (error) {
        console.error("Error parsing cp_type cookie:", error);
      }
    }
  }, []);

  // Fetch country list on component mount
  useEffect(() => {
    getCountryList();
  }, []);

  // Handle input change for mobile numbers (limit to 10 digits)
  const handleInputChange = (e, field) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      if (sameAsMobile && field === "primaryMobileNumber") {
        newFormData.whatsappNumber = value;
      }
      return newFormData;
    });
  };

  // Handle blur for input fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Fetch channel partner types based on search
  const channelPartnerList = async (searchTerm) => {
    try {
      const response = await axios.get(
        `v2/cp/channelPartner/types?search=${searchTerm}`
      );
      if (response?.data?.success === true) {
        setCp_List(response?.data?.data);
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

  // Add new channel partner type
  const addChannelPartner = async (newType) => {
    try {
      const response = await axios.post("v2/cp/channelPartner/types", {
        type: newType,
      });
      if (response?.data?.success === true) {
        showSuccessToast("Channel Partner Type Added");
        await channelPartnerList(search);
      }
    } catch (error) {
      // console.log("error", error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(
          error?.response?.data?.error?.message ||
            "Failed to add new channel partner type"
        );
        throw error;
      }
    }
  };

  // Check username availability
  const checkUserNameAvailability = async (userName) => {
    try {
      setIsCheckingUserName(true);
      const response = await axios.post(`v2/cp/channelPartner/check`, {
        username: userName,
      });
      if (response?.data?.success) {
        setIsUserNameAvailable(response?.data?.data?.available);
      }
    } catch (error) {
      // console.log(error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        setIsUserNameAvailable(false);
      }
    } finally {
      setIsCheckingUserName(false);
    }
  };

  // Handle save and continue
  const handleSave = () => {
    if (isFormValid()) {
      setCookie("cp_type", formData);
      router.push("/sales/cp_clinic_details");
    } else {
      showErrorToast("Please fill all required fields correctly");
    }
  };

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

  // Fetch types when search changes
  useEffect(() => {
    channelPartnerList(search);
  }, [search]);

  // Check username availability with debounce
  useEffect(() => {
    if (formData.userName && touched.userName) {
      const timer = setTimeout(
        () => checkUserNameAvailability(formData.userName),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [formData.userName, touched.userName]);

  // Validation functions
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  const isFormValid = () => {
    return (
      formData.type &&
      formData.clinicName &&
      formData.userName &&
      isUserNameAvailable === true &&
      isEmailValid(formData.email) &&
      isMobileValid(formData.primaryMobileNumber) &&
      isMobileValid(formData.whatsappNumber) &&
      isMobileValid(formData.emergencyNumber)
    );
  };

  // Options for CreatableSelect
  const options = cp_list.map((item) => ({
    value: item.type,
    label: item.type,
  }));

  // Country options for Select
  const countryOptions = useMemo(
    () =>
      countryList.map((country) => ({
        value: `${country.flag} ${country.code}`,
        label: `${country.flag} ${country.code}`,
        name: country.name,
      })),
    [countryList]
  );

  return (
    <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col max-w-[576px] mx-auto">
      <CP_Header />
      <div className="min-h-screen pt-[8%] lg:pt-[8%] pb-[20%] lg:pb-[14%] overflow-auto px-[17px] bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5]">
        <div>
          <Label htmlFor="type" className="text-[15px] text-gray-500 mb-2 mt-5">
            Type of Channel Partner *
          </Label>
          <CreatableSelect
            styles={{
              control: (base) => ({ ...base, borderRadius: "7.26px" }),
            }}
            options={options}
            value={
              formData.type
                ? { value: formData.type, label: formData.type }
                : null
            }
            onChange={(selectedOption) =>
              setFormData({
                ...formData,
                type: selectedOption ? selectedOption.value : "",
              })
            }
            onInputChange={(inputValue) => setSearch(inputValue)}
            onBlur={() => handleBlur("type")}
            placeholder="Select or create type"
            isClearable
            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
            onCreateOption={async (inputValue) => {
              try {
                await addChannelPartner(inputValue);
                setFormData({ ...formData, type: inputValue });
                setTouched((prev) => ({ ...prev, type: true }));
              } catch (error) {
                // Error is already toasted in addChannelPartner
              }
            }}
            className="text-[15px] rounded-[12px] font-semibold border-none outline-none"
          />
          {touched.type && !formData.type && (
            <span className="text-red-500 text-sm mt-1 block">
              Type is required
            </span>
          )}

          {/* Clinic Details */}
          <div className="mt-5 bg-[#FFFFFF80] rounded-[12px] p-4">
            <strong className="text-[15px] text-black font-semibold">
              Clinic Details
            </strong>
            <div>
              <Label
                htmlFor="clinicName"
                className={`text-[15px] mb-2 mt-5 ${
                  formData.type ? "text-gray-500" : "text-[#00000040]"
                }`}
              >
                Clinic Name *
              </Label>
              <Input
                id="clinicName"
                type="text"
                placeholder="Enter clinic name"
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData({ ...formData, clinicName: e.target.value })
                }
                onBlur={() => handleBlur("clinicName")}
                disabled={!formData.type}
                className={`rounded-[7.26px] font-semibold py-3 px-4 h-[39px] ${
                  formData.type
                    ? "bg-white placeholder:text-[15px] placeholder:text-gray-500"
                    : "bg-[#ffffff90]"
                }`}
              />
              {touched.clinicName && !formData.clinicName && (
                <span className="text-red-500 text-sm mt-1 block">
                  Clinic name is required
                </span>
              )}
            </div>
            <div>
              <Label
                htmlFor="userName"
                className={`text-[15px] mb-2 mt-[22px] ${
                  formData.clinicName ? "text-gray-500" : "text-[#00000040]"
                }`}
              >
                Unique URL *
              </Label>
              <div className="flex gap-[10px] items-center">
                <span className="text-[15px] text-gray-600">ekyamm.com/</span>
                <div className="relative w-full">
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Enter URL name"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    onBlur={() => handleBlur("userName")}
                    disabled={!formData.clinicName}
                    className={`w-full rounded-[7.26px] font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                      formData.clinicName
                        ? "bg-white placeholder:text-gray-500"
                        : "bg-[#ffffff90] placeholder:text-[#00000040]"
                    }`}
                  />
                  {/* Only show icon if username is not empty */}
                  {formData.userName && isUserNameAvailable === true && (
                    <Image
                      src="/images/green_check.png"
                      width={20}
                      height={20}
                      className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                      alt="check"
                    />
                  )}
                  {formData.userName && isUserNameAvailable === false && (
                    <Image
                      src="/images/error_circle.png"
                      width={20}
                      height={20}
                      className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                      alt="check"
                    />
                  )}
                </div>
              </div>
              {/* Error messages */}
              {touched.userName && isCheckingUserName && (
                <span className="text-yellow-500 text-sm mt-1 block">
                  Checking...
                </span>
              )}
              {touched.userName &&
                !isCheckingUserName &&
                !formData.userName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Username is required
                  </span>
                )}
              {touched.userName &&
                !isCheckingUserName &&
                formData.userName &&
                isUserNameAvailable === false && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Username not available
                  </span>
                )}
            </div>
            <div>
              <Label
                htmlFor="email"
                className={`text-[15px] mb-2 mt-[22px] ${
                  formData.userName && isUserNameAvailable === true
                    ? "text-gray-500"
                    : "text-[#00000040]"
                }`}
              >
                Clinic Primary Email Address *
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
                onBlur={() => handleBlur("email")}
                disabled={!formData.userName || isUserNameAvailable !== true}
                className={`rounded-[7.26px] font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                  formData.userName && isUserNameAvailable === true
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                }`}
              />

              {touched.email &&
                formData.email &&
                !isEmailValid(formData.email) && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Invalid email
                  </span>
                )}
              {touched.email && !formData.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  Email is required
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
                Clinic Primary Mobile Number *
              </Label>
              <div className="flex items-center gap-3 h-[39px]">
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
                      ...(sameAsMobile && {
                        countryCode_whatsapp: newCountryCode,
                      }),
                    }));
                  }}
                  isDisabled={!isEmailValid(formData.email)}
                  className="w-[100px] border-none shadow-none"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "7.26px 0 0 7.26px",
                      borderRightWidth: 0,
                      height: "39px",
                      minHeight: "39px",
                      width: "max-content",
                      backgroundColor: isEmailValid(formData.email)
                        ? "#fff"
                        : "#f6f5fd",
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
                  id="primaryMobileNumber"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  placeholder="Enter primary mobile no."
                  value={formData.primaryMobileNumber}
                  onChange={(e) => handleInputChange(e, "primaryMobileNumber")}
                  onBlur={() => handleBlur("primaryMobileNumber")}
                  disabled={!isEmailValid(formData.email)}
                  className={`border rounded-[7.26px] font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                    isEmailValid(formData.email)
                      ? "bg-white placeholder:text-gray-500"
                      : "bg-[#ffffff90] placeholder:text-[#00000040]"
                  }`}
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
            <div className="mt-[22px]">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="whatsappNumber"
                  className={`text-[15px] w-[55%] max-[576px]:w-[80%] ${
                    isMobileValid(formData.primaryMobileNumber)
                      ? "text-gray-500 border-0 shadow-none"
                      : "text-[#00000040] border-0 shadow-none"
                  }`}
                >
                  Clinic Whatsapp Number *
                </Label>
                <div className="flex gap-[6px] items-center justify-end w-[45%]">
                  <Checkbox
                  id="same_as_mobile"
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
                    className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] "
                  />
                  <label
                  htmlFor="same_as_mobile"
                    className={`text-[12px] ${
                      isMobileValid(formData.primaryMobileNumber)
                        ? "text-gray-500 "
                        : "text-[#00000040]"
                    }`}
                  >
                    Same as Mobile Number
                  </label>
                </div>
              </div>
              <div className="flex items-center h-[39px] gap-3">
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.countryCode_whatsapp
                  )}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      countryCode_whatsapp: selectedOption
                        ? selectedOption.value
                        : "🇮🇳 +91",
                    })
                  }
                  isDisabled={
                    sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                  }
                  className="w-[100px] border-none shadow-none "
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "7.26px 0 0 7.26px",
                      borderRightWidth: 0,
                      height: "39px",
                      minHeight: "39px",
                      width: "max-content",
                      backgroundColor:
                        sameAsMobile ||
                        isMobileValid(formData.primaryMobileNumber)
                          ? "#fff"
                          : "#f6f5fd",
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
                  id="whatsappNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter whatsapp no."
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange(e, "whatsappNumber")}
                  onBlur={() => handleBlur("whatsappNumber")}
                  disabled={
                    sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                  }
                  className={`rounded-[7.26px] border-0 font-semibold rounded-l-none placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                    sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                      ? "bg-[#ffffff90] placeholder:text-[#00000040] border-0 shadow-none"
                      : "bg-white placeholder:text-gray-500 border-0 shadow-none"
                  }`}
                />
              </div>
              {touched.whatsappNumber &&
                formData.whatsappNumber &&
                !isMobileValid(formData.whatsappNumber) && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Must be 10 digits
                  </span>
                )}
              {touched.whatsappNumber && !formData.whatsappNumber && (
                <span className="text-red-500 text-sm mt-1 block">
                  WhatsApp number is required
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
                Clinic Emergency Number *
              </Label>
              <div className="flex items-center gap-3 h-[39px]">
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.countryCode_emergency
                  )}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      countryCode_emergency: selectedOption
                        ? selectedOption.value
                        : "🇮🇳 +91",
                    })
                  }
                  isDisabled={!isMobileValid(formData.whatsappNumber)}
                  className="w-[100px] border-none shadow-none"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "7.26px 0 0 7.26px",
                      borderRightWidth: 0,
                      height: "39px",
                      minHeight: "39px",
                      width: "max-content",
                      backgroundColor: isMobileValid(formData.whatsappNumber)
                        ? "#fff"
                        : "#f6f5fd",
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
                  id="emergencyNumber"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter emergency mobile no."
                  value={formData.emergencyNumber}
                  onChange={(e) => handleInputChange(e, "emergencyNumber")}
                  onBlur={() => handleBlur("emergencyNumber")}
                  disabled={!isMobileValid(formData.whatsappNumber)}
                  className={`border rounded-[7.26px] font-semibold rounded-l-none shadow border-l-0 placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${
                    isMobileValid(formData.whatsappNumber)
                      ? "bg-white placeholder:text-gray-500 border-0 shadow-none"
                      : "bg-[#ffffff90] placeholder:text-[#00000040] border-0 shadow-none"
                  }`}
                />
              </div>
              {touched.emergencyNumber &&
                formData.emergencyNumber &&
                !isMobileValid(formData.emergencyNumber) && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Must be 10 digits
                  </span>
                )}
              {touched.emergencyNumber && !formData.emergencyNumber && (
                <span className="text-red-500 text-sm mt-1 block">
                  Emergency number is required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <CP_buttons
        disabled={!isFormValid()}
        onSave={handleSave}
        buttonText={"Save & Continue"}
      />
    </div>
  );
};

export default CP_type;
