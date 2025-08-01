"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "../../../ui/button";
import { isMobile } from "react-device-detect";
import IP_Buttons from "../IP_Buttons/IP_Buttons";
import IP_Header from "../IP_Header/IP_Header";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";
import axiosInstance from "@/lib/axiosInstance";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { getCookie, hasCookie } from "cookies-next";
import { useRememberMe } from "@/app/context/RememberMeContext";
polyfillCountryFlagEmojis();

const IP_Details = () => {
  const { rememberMe } = useRememberMe()
  const router = useRouter();
  const axios = axiosInstance();
  const [formData, setFormData] = useState({
    profileImageBase64: "", // Store base64 string instead of URL
    title: "Dr.",
    firstName: "",
    lastName: "",
    email: "",
    countryCode_primary: "🇮🇳 +91",
    primaryMobileNumber: "",
    countryCode_whatsapp: "🇮🇳 +91",
    whatsappNumber: "",
    countryCode_emergency: "🇮🇳 +91",
    emergencyNumber: "",
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
  const [isMobileAvailable, setIsMobileAvailable] = useState(null);
  const [isCheckingMobile, setIsCheckingMobile] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [countrySearch, setCountrySearch] = useState("");
  const cameraInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [doNotAddMeToEpn, setDoNotAddMeToEpn] = useState(false);
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
        showErrorToast(
          error?.response?.data?.error?.message || "Something Went Wrong"
        );
      }
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = rememberMe ? localStorage.getItem("ip_details") : sessionStorage.getItem("ip_details")
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
        setFormData({
          profileImageBase64: parsedData.profileImageBase64 || "",
          title: parsedData.title || "Dr.",
          firstName: rawFirstName || "",
          lastName: parsedData.lastName || "",
          email: parsedData.email || "",
          countryCode_primary: parsedData.countryCode_primary || "🇮🇳 +91",
          primaryMobileNumber: parsedData.primaryMobileNumber || "",
          countryCode_whatsapp: parsedData.countryCode_whatsapp || "🇮🇳 +91",
          whatsappNumber: parsedData.whatsappNumber || "",
          countryCode_emergency: parsedData.countryCode_emergency || "🇮🇳 +91",
          emergencyNumber: parsedData.emergencyNumber || "",
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
        console.error("Error parsing ip_details from localStorage:", error);
      }
    }
    getCountryList();
  }, []);

  // Handle file selection for photo upload or capture
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, profileImageBase64: base64 }));
        handleCloseDrawer();
      } catch (error) {
        console.error("Error converting file to base64:", error);
        showErrorToast("Failed to upload profile image");
      }
    }
  };

  // Handle photo deletion
  const handlePhotoDelete = () => {
    setFormData((prev) => ({ ...prev, profileImageBase64: "" }));
    handleCloseDrawer();
  };

  // Trigger camera input
  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Trigger photo input
  const handleChoosePhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

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
    handleBlur(field);
  };

  // Handle text input change for firstName, lastName, and email
  const handleTextInputChange = (e, field) => {
    if (field === "email") {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value.toLowerCase(),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
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
  const handleSave = async () => {
    if (isFormValid()) {
      try {
        const saveData = {
          ...formData,
          firstName: formData.title
            ? `${formData.title} ${formData.firstName}`
            : formData.firstName,
        };
        if (rememberMe) {
          localStorage.setItem("ip_details", JSON.stringify(saveData));
        }
        else {
          sessionStorage.setItem("ip_details", JSON.stringify(saveData));
        }
        if (doNotAddMeToEpn) {
          let profileImageUrl = formData.profileImageBase64
          if (formData?.profileImageBase64 && !profileImageUrl) {
            profileImageUrl =
              (await uploadImage(formData?.profileImageBase64, "profile")) || "";
          }
          const response = await axios.post(`/v2/sales/invite/individualPractitioner`, {
            "practitionerDetails": {
              "generalInformation": {
                "profileImageUrl": profileImageUrl,
                "firstName": saveData?.firstName,
                "lastName": saveData?.lastName,
                "email": saveData?.email,
                "countryCode_primary": saveData?.countryCode_primary,
                "primaryMobileNumber": saveData?.primaryMobileNumber,
                "countryCode_whatsapp": saveData?.countryCode_whatsapp,
                "whatsappNumber": saveData?.whatsappNumber,
                "countryCode_emergency": saveData?.countryCode_emergency,
                "emergencyNumber": saveData?.emergencyNumber,
                "residentialAddress": "",
                "googleMapAddress": "",
              },
              "doNotAddToEPN": true
            }
          })
          if (response?.data?.success === true) {
            if (rememberMe) {
              localStorage.removeItem("ip_details");
              localStorage.removeItem("ip_bank_details");
              localStorage.removeItem("ip_general_information");
              localStorage.removeItem("ip_medical_association_details");
              localStorage.removeItem("ip_single_session_fees");
              localStorage.removeItem("doNotHaveGST");
              localStorage.removeItem("doNotHaveMedicalAssociation");
            }
            else {
              sessionStorage.removeItem("ip_details");
              sessionStorage.removeItem("ip_bank_details");
              sessionStorage.removeItem("ip_general_information");
              sessionStorage.removeItem("ip_medical_association_details");
              sessionStorage.removeItem("ip_single_session_fees");
              sessionStorage.removeItem("doNotHaveGST");
              sessionStorage.removeItem("doNotHaveMedicalAssociation");
            }
            router.push("/sales");
            showSuccessToast("Invite Sent");
          }
        }
        else {
          router.push("/sales/ip_general_information");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        showErrorToast("Failed to send invite");
      }
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
  const countryOptions = useMemo(
    () =>
      countryList.map((country) => ({
        value: `${country.flag} ${country.code}`,
        label: `${country.flag} ${country.code}`,
        name: country.name,
      })),
    [countryList]
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const checkMobileAvailability = async (mobile, country_code) => {
    try {
      setIsCheckingMobile(true);
      const response = await axios.post(`/v2/sales/mobile/verify`, {
        type: "IP",
        countryCode: country_code,
        mobile: mobile,
      });
      if (response?.data?.success) {
        setIsMobileAvailable(true);
      }
    } catch (error) {
      // console.log(error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        setIsMobileAvailable(false);
      }
    } finally {
      setIsCheckingMobile(false);
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      setIsCheckingEmail(true);
      const response = await axios.post(`/v2/sales/email/verify`, {
        type: "IP",
        email: email,
      });
      if (response?.data?.success) {
        setIsEmailAvailable(true);
      }
    } catch (error) {
      // console.log(error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        setIsEmailAvailable(false);
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  useEffect(() => {
    if (formData.primaryMobileNumber && touched.primaryMobileNumber) {
      if (formData.primaryMobileNumber.length === 10) {
        checkMobileAvailability(formData.primaryMobileNumber, formData.countryCode_primary)
      }
    }
  }, [formData.countryCode_primary, formData.primaryMobileNumber, touched.primaryMobileNumber])

  useEffect(() => {
    if (formData.email && touched.email) {
      if (isEmailValid(formData.email)) {
        checkEmailAvailability(formData.email)
      }
    }
  }, [formData.email, touched.email])

  useEffect(() => {
    const token = hasCookie("user") ? JSON.parse(getCookie("user")) : null
    if (!token) {
      router.push('/login')
    }
  }, [])
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto relative">
      <IP_Header text="Add Individual Practitioner Details" />
      <div className="h-full pt-[15%] md:pt-[10%] pb-[22%] overflow-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
        <div className="flex justify-center w-[140.8px] h-fit rounded-[17.63px] mx-auto relative mb-6">
          <Image
            src={formData.profileImageBase64 || "/images/profile.png"}
            width={100}
            height={90}
            className="w-full h-fit object-cover"
            alt="Profile"
          />
          <Drawer open={drawerOpen} onClose={handleCloseDrawer}>
            <DrawerTrigger>
              <Image
                src="/images/camera.png"
                width={31}
                height={31}
                className="w-[31px] h-fit absolute bottom-[-10px] right-[-10px]"
                alt="Camera"
                onClick={() => setDrawerOpen(true)}
              />
            </DrawerTrigger>
            <DrawerTitle></DrawerTitle>
            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] bottom-drawer">
              <DrawerHeader>
                <DrawerDescription className="flex flex-col gap-3">
                  {isMobile && (
                    <Button
                      className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px] rounded-[8.62px]"
                      onClick={handleTakePhoto}
                    >
                      Take Photo
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="Arrow"
                      />
                    </Button>
                  )}
                  <Button
                    className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px] rounded-[8.62px]"
                    onClick={handleChoosePhoto}
                  >
                    Choose Photo
                    <Image
                      src="/images/arrow.png"
                      width={24}
                      height={24}
                      className="w-[24px]"
                      alt="Arrow"
                    />
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px] rounded-[8.62px]"
                    onClick={handlePhotoDelete}
                  >
                    Delete Photo
                    <Image
                      src="/images/arrow.png"
                      width={24}
                      height={24}
                      className="w-[24px]"
                      alt="Arrow"
                    />
                  </Button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="p-0"></DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="mt-3 bg-[#FFFFFF80] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">
            Practitioner Details
          </strong>
          <div>
            <Label className="text-[15px] text-gray-500 mb-[7.59px] mt-3">
              Title & First Name *
            </Label>
            <div className="flex gap-2 items-center">
              <UISelect
                value={formData.title}
                onValueChange={handleTitleChange}
              >
                <SelectTrigger className="w-[69px] bg-white rounded-[7.26px] text-[15px] text-black font-semibold h-[39px] px-3">
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
                placeholder="Enter your name"
                value={formData.firstName}
                onChange={(e) => handleTextInputChange(e, "firstName")}
                onBlur={() => handleBlur("firstName")}
                disabled={!formData.title}
                className={`flex-1 rounded-[7.26px] text-[15px]text-black font-semibold placeholder:text-[15px]    py-3 px-4 h-[39px] ${formData.title
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
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
              className={`text-[15px] mb-[7.59px] mt-[22px] ${formData.firstName ? "text-gray-500" : "text-[#00000040]"
                }`}
            >
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleTextInputChange(e, "lastName")}
              onBlur={() => handleBlur("lastName")}
              disabled={!formData.firstName}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${formData.firstName
                ? "bg-white placeholder:text-gray-500"
                : "bg-[#ffffff90] placeholder:text-[#00000040]"
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
              className={`text-[15px] mb-[7.59px] mt-[22px] ${formData.lastName ? "text-gray-500" : "text-[#00000040]"
                }`}
            >
              Primary Email Address *
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  handleTextInputChange(e, "email"), setIsEmailAvailable(null)
                  if (isEmailValid(e.target.value)) {
                    setTouched((prev) => ({ ...prev, email: true }));
                  }
                }}
                onBlur={() => handleBlur("email")}
                disabled={!formData.lastName}
                className={`rounded-[7.26px] text-[15px]text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${formData.lastName
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
                  }`}
              />

              {formData.email && isEmailAvailable === true && (
                <Image
                  src="/images/green_check.png"
                  width={20}
                  height={20}
                  className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                  alt="check"
                />
              )}
              {formData.email && isEmailAvailable === false && (
                <Image
                  src="/images/error_circle.png"
                  width={20}
                  height={20}
                  className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                  alt="check"
                />
              )}

            </div>
            {touched.email && isCheckingEmail && (
              <span className="text-yellow-500 text-sm mt-1 block">
                Checking...
              </span>
            )}
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
            {touched.email &&
              !isCheckingEmail &&
              isEmailValid(formData.email) &&
              formData.email &&
              isEmailAvailable === false && (
                <span className="text-red-500 text-sm mt-1 block">
                  Email not available
                </span>
              )}
          </div>
          <div className="mt-[22px]">
            <Label
              htmlFor="primaryMobileNumber"
              className={`text-[15px] mb-[7.59px] ${isEmailValid(formData.email) && isEmailAvailable === true
                ? "text-gray-500"
                : "text-[#00000040]"
                }`}
            >
              Primary Mobile Number *
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
                isDisabled={!isEmailValid(formData.email) || isEmailAvailable === false || isCheckingEmail}
                className="w-[100px] border-none focus:border-none hover:border-none hover:outline-none shadow-none"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                    backgroundColor: isEmailValid(formData.email) && isEmailAvailable === true
                      ? "#fff"
                      : "#faf5f8",
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
              <div className="relative w-full">
                <Input
                  id="primaryMobileNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter primary mobile no."
                  value={formData.primaryMobileNumber}
                  onChange={(e) => {
                    handleInputChange(e, "primaryMobileNumber");
                    setIsMobileAvailable(null);
                  }}
                  onBlur={() => { handleBlur("primaryMobileNumber") }}
                  disabled={!isEmailValid(formData.email) || isEmailAvailable === false || isCheckingEmail}
                  className={`rounded-[7.26px]  border-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${isEmailValid(formData.email)
                    ? "bg-white placeholder:text-gray-500 border-0 shadow-none"
                    : "bg-[#ffffff90] placeholder:text-[#00000040] border-0 shadow-none"
                    }`}
                  maxLength={10}
                />
                {formData.primaryMobileNumber && isMobileAvailable === true && (
                  <Image
                    src="/images/green_check.png"
                    width={20}
                    height={20}
                    className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                    alt="check"
                  />
                )}
                {formData.primaryMobileNumber && isMobileAvailable === false && (
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
            {touched.primaryMobileNumber && isCheckingMobile && (
              <span className="text-yellow-500 text-sm mt-1 block">
                Checking...
              </span>
            )}
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
            {touched.primaryMobileNumber &&
              !isCheckingMobile &&
              isMobileValid(formData.primaryMobileNumber) &&
              formData.primaryMobileNumber &&
              isMobileAvailable === false && (
                <span className="text-red-500 text-sm mt-1 block">
                  Mobile number not available
                </span>
              )}
          </div>
          <div className="mt-[22px]">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="whatsappNumber"
                className={`text-[15px] mb-[7.59px] ${isMobileValid(formData.primaryMobileNumber) && isMobileAvailable === true
                  ? "text-gray-500"
                  : "text-[#00000040]"
                  }`}
              >
                Whatsapp Number *
              </Label>
              <div className="flex gap-[6px] items-center">
                <Checkbox
                  id='same_as_mobile'
                  className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1"
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
                  disabled={!isMobileValid(formData.primaryMobileNumber) || isMobileAvailable === false}
                />
                <label
                  className={`text-[12px] ${isMobileValid(formData.primaryMobileNumber) && isMobileAvailable === true
                    ? "text-gray-500"
                    : "text-[#00000040]"
                    }`}
                  htmlFor="same_as_mobile">
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
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber) || isMobileAvailable === false
                }
                className="w-[100px] border-none focus:border-none shadow-none"
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
                        isMobileValid(formData.primaryMobileNumber) && isMobileAvailable === true
                        ? "#fff"
                        : "#faf5f8",
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
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber) || isMobileAvailable === false
                }
                className={`border rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${sameAsMobile || !isMobileValid(formData.primaryMobileNumber) || isMobileAvailable === false
                  ? "bg-[#ffffff90] placeholder:text-[#00000040]"
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
              className={`text-[15px] mb-[7.59px] ${isMobileValid(formData.whatsappNumber)
                ? "text-gray-500"
                : "text-[#00000040]"
                }`}
            >
              Emergency Number *
            </Label>
            <div className="flex items-center h-[39px] gap-3">
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
                className="w-[100px] border-none focus:border-none shadow-none"
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
                      : "#faf5f8",
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
                type="text"
                placeholder="Enter emergency no."
                value={formData.emergencyNumber}
                onChange={(e) => handleInputChange(e, "emergencyNumber")}
                onBlur={() => handleBlur("emergencyNumber")}
                disabled={!isMobileValid(formData.whatsappNumber)}
                className={`border rounded-[7.26px] rounded-l-none border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${isMobileValid(formData.whatsappNumber)
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
                  }`}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
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
        <div className="mt-5 flex items-center gap-2">
        <Checkbox
          id='do_not_add_me_to_epn'
          className="w-4 h-4 border border-[#776EA5] rounded-[1.8px]"
          checked={doNotAddMeToEpn}
          onCheckedChange={(checked) => setDoNotAddMeToEpn(checked)}
        />
          <Label htmlFor="do_not_add_me_to_epn">Do not add me to EPN</Label>
         </div>
        </div>
        <IP_Buttons
          disabled={!isFormValid()}
          onSave={handleSave}
          buttonText={doNotAddMeToEpn ? "Send Invite" : "Save & Continue"}
        />
      </div>
    </div>
  );
};

export default IP_Details;
