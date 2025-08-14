"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import axiosInstance from "@/lib/axiosInstance";
import { Baseurl } from "@/lib/constants";
import Select from "react-select";
import axios from "axios";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { isMobile } from "react-device-detect";
import PP_Header from "../PP_Header/PP_Header";
import { base64ToFile, getStorage, setStorage } from "@/lib/utils";
import { X } from "lucide-react";
import { useRememberMe } from "@/app/context/RememberMeContext";
polyfillCountryFlagEmojis();

const PP_Details = ({ type }) => {
  const { rememberMe } = useRememberMe();
  const router = useRouter();
  const customAxios = axiosInstance();
  const cameraInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [patientData, setPatientData] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    profileImageBase64: "",
    firstName: "",
    lastName: "",
    countryCode_primary: "🇮🇳 +91",
    primaryMobileNumber: "",
    email: "",
    countryCode_whatsapp: "🇮🇳 +91",
    whatsappNumber: "",
    gender: "",
    addressDetails: {
      pincode: "",
      area: "",
      city: "",
      state: "",
    },
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    primaryMobileNumber: false,
    whatsappNumber: false,
    gender: false,
    addressDetails: {
      pincode: false,
    },
  });

  // Validation functions
  const isPincodeValid = (pincode) => /^\d{6}$/.test(pincode);
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  const isFormValid = () =>
    formData.firstName &&
    formData.lastName &&
    isMobileValid(formData.primaryMobileNumber) &&
    formData.gender &&
    isPincodeValid(formData.addressDetails.pincode) &&
    (!formData.whatsappNumber || isMobileValid(formData.whatsappNumber)) &&
    (!formData.email || isEmailValid(formData.email));

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

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Fetch country list
  const getCountryList = async () => {
    try {
      const response = await customAxios.get(`v2/country?search=`);
      if (response?.data?.success) {
        setCountryList(response?.data?.data);
      }
    } catch (error) {
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(
          error?.response?.data?.error?.message || "Something Went Wrong"
        );
      }
    }
  };

  // Fetch patient data and verify channel partner
  useEffect(() => {
    // const userCookie = getCookie("patientSessionData");
    const userCookie = getStorage("patientSessionData", rememberMe);
    if (!userCookie) {
      router.push(`/patient/${type}/create/password`);
      return;
    }
    const parsedPatientData = userCookie
    setPatientData(parsedPatientData);

    const verifyChannelPartner = async (username) => {
      setLoading(true);
      try {
        const response = await customAxios.post(`v2/cp/channelPartner/verify`, {
          username: type,
        });
        if (response?.data?.success) {
          setCookie("channelPartnerData", JSON.stringify(response.data.data));
          setStorage("channelPartnerData", response?.data?.data);
          setChannelPartnerData(response.data.data);
          // setFormData((prev) => ({
          //   ...prev,
          //   verificationToken: response.data.data?.verificationToken,
          // }));
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

    const getPatient = async () => {
      try {
        // const userData = JSON.parse(getCookie("patientSessionData"));
        const userData = getStorage("patientSessionData", rememberMe);
        const token = userData?.token;
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient/`, {
          headers: {
            accesstoken: token,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          const data = response?.data?.data;
          setFormData((prev) => ({
            ...prev,
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            countryCode_primary: data?.countryCode_primary || "🇮🇳 +91",
            primaryMobileNumber: data?.primaryMobileNumber || "",
            email: data?.email || "",
          }));
          setTouched((prev) => ({
            ...prev,
            firstName: !!data?.firstName,
            lastName: !!data?.lastName,
            primaryMobileNumber: !!data?.primaryMobileNumber,
            email: !!data?.email,
          }));
        }
      } catch (err) {
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      }
    };

    // Load from localStorage
    const savedData = localStorage.getItem("pp_details");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          profileImageBase64: parsedData.profileImageBase64 || "",
          firstName: parsedData.firstName || "",
          lastName: parsedData.lastName || "",
          countryCode_whatsapp: parsedData.countryCode_whatsapp || "🇮🇳 +91",
          whatsappNumber: parsedData.whatsappNumber || "",
          gender: parsedData.gender || "",
          addressDetails: {
            pincode: parsedData.addressDetails?.pincode || "",
            area: parsedData.addressDetails?.area || "",
            city: parsedData.addressDetails?.city || "",
            state: parsedData.addressDetails?.state || "",
          },
        }));
        setSameAsMobile(
          parsedData.whatsappNumber === parsedData.primaryMobileNumber
        );
        setTouched((prev) => ({
          ...prev,
          firstName: !!parsedData.firstName,
          lastName: !!parsedData.lastName,
          whatsappNumber: !!parsedData.whatsappNumber,
          gender: !!parsedData.gender,
          addressDetails: {
            pincode: !!parsedData.addressDetails?.pincode,
          },
        }));
      } catch (error) {
        console.error("Error parsing pp_details from localStorage:", error);
      }
    }

    getCountryList();
    verifyChannelPartner(type);
    getPatient();
  }, [type]);

  // Handle photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, profileImageBase64: base64 }));
        setDrawerOpen(false);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        showErrorToast("Failed to upload profile image");
      }
    }
  };

  // Handle photo deletion
  const handlePhotoDelete = () => {
    setFormData((prev) => ({ ...prev, profileImageBase64: "" }));
    setDrawerOpen(false);
  };

  // Trigger camera/photo input
  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleChoosePhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  // Handle input change for mobile numbers
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

  // Handle text input change
  const handleTextInputChange = (e, field, subField = null) => {
    const value =
      field === "email" ? e.target.value.toLowerCase() : e.target.value;
    if (subField) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subField]: value },
      }));
      handleBlur(field + "." + subField);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      handleBlur(field);
    }
  };

  // Handle PIN code change
  const handlePinCodeChange = async (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      addressDetails: { ...prev.addressDetails, pincode: digitsOnly },
    }));
    handleBlur("pincode");

    if (digitsOnly.length === 6 && isPincodeValid(digitsOnly)) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${digitsOnly}`
        );
        if (response?.data[0]?.Status === "Success") {
          const { State, District, Name, Block } =
            response?.data[0]?.PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            addressDetails: {
              ...prev.addressDetails,
              area: Name,
              city: Block === "NA" ? District : Block,
              state: State,
            },
          }));
          setTouched((prev) => ({
            ...prev,
            addressDetails: {
              ...prev.addressDetails,
              area: true,
              city: true,
              state: true,
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            addressDetails: {
              ...prev.addressDetails,
              area: "",
              city: "",
              state: "",
            },
          }));
          showErrorToast("Invalid PIN code");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        showErrorToast("Failed to fetch location data");
        setFormData((prev) => ({
          ...prev,
          addressDetails: {
            ...prev.addressDetails,
            area: "",
            city: "",
            state: "",
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        addressDetails: {
          ...prev.addressDetails,
          area: "",
          city: "",
          state: "",
        },
      }));
    }
  };

  // Handle gender change
  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    handleBlur("gender");
  };

  // Handle blur
  const handleBlur = (field) => {
    if (field === "pincode" || field.startsWith("addressDetails.")) {
      const subField = field === "pincode" ? "pincode" : field.split(".")[1];
      setTouched((prev) => ({
        ...prev,
        addressDetails: { ...prev.addressDetails, [subField]: true },
      }));
    } else {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleSave = async () => {
    if (isFormValid()) {
      localStorage.setItem("pp_details", JSON.stringify(formData))
      handleUpdatePatientDetails();
    } else {
      setTouched({
        firstName: true,
        lastName: true,
        primaryMobileNumber: true,
        whatsappNumber: true,
        gender: true,
        addressDetails: { pincode: true, area: true },
      });
      showErrorToast("Please fill all required fields correctly");
    }
  };

  useEffect(() => {
    // const userDataCookie = getCookie("patientSessionData");
    const userDataCookie = getStorage("patientSessionData", rememberMe);
    let token;
    if (userDataCookie) {
      try {
        token = userDataCookie.token;
      } catch (error) {
        console.error("Error parsing userData cookie:", error);
      }
    }
    setToken(token);
    if (!token) {
      showErrorToast("Authentication required. Please log in.");
      router.push(`/patient/${type}/create/password`);
      return;
    }
  }, []);

  const handleUpdatePatientDetails = async () => {
    setIsLoading(true);
    try {
      let updatedFormData = { ...formData }
      if (formData?.profileImageBase64) {
        const imageUrl =
          (await uploadImage(formData?.profileImageBase64, "profile")) || "";
        updatedFormData.profileImageUrl = imageUrl;
      }
      const { profileImageBase64, ...payload } = updatedFormData;
      const response = await axios.put(
        process.env.NEXT_PUBLIC_BASE_URL + `/v2/cp/patient/update`,
        {
          patientDetails: payload,
        },
        {
          headers: {
            accesstoken: token,
          },
        }
      );
      if (response?.data?.success) {
        // setCookie("PatientInfo", JSON.stringify(response?.data?.data));
        setStorage("PatientInfo", response?.data?.data);
        router.push(`/patient/${type}/family-details`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorToast(error?.response?.data?.error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (filename, type) => {
    try {
      const file = await base64ToFile(filename, 0.6);
      const form = new FormData();
      form.append("filename", file);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + `/v2/psychiatrist/uploadImage`,
        form,
        {
          headers: {
            accesstoken: token,
          },
        }
      );
      if (response?.data?.success) {
        const imageUrl = response?.data?.image;
        return imageUrl;
      }
    } catch (error) {
      if (error.forceLogout) {
        router.push("/patient/login");
      } else {
        showErrorToast(error?.response?.data?.error?.message);
      }
      return null;
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <PP_Header />
      <div className="h-full pb-[26%] overflow-auto px-[17px]">
        {/* Profile Section */}
        <div className="flex justify-center w-[140.8px] h-fit rounded-[17.63px] mx-auto relative mb-6">
          <Image
            src={formData.profileImageBase64 || "/images/profile.png"}
            width={100}
            height={90}
            className="w-full h-fit object-fill"
            alt="Profile"
          />
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <DrawerTrigger>
              <Image
                src="/images/camera.png"
                width={31}
                height={31}
                className="w-[31px] h-fit absolute bottom-[-10px] right-[-10px] "
                alt="Camera"
                onClick={() => setDrawerOpen(true)}
              />
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] rounded-t-[12px]"
              style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
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

        {/* Form */}
        <div className=" rounded-[12px] ">
          {/* First Name */}
          <div>
            <Label className="text-[15px] text-gray-500 mb-[7.59px] mt-3">
              First Name *
            </Label>
            <Input
              placeholder="Enter First Name"
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px]"
              value={formData.firstName}
              onChange={(e) => handleTextInputChange(e, "firstName")}
              onBlur={() => handleBlur("firstName")}
            />
            {touched.firstName && !formData.firstName && (
              <span className="text-red-500 text-sm mt-1 block">
                First Name is required
              </span>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label
              className={`text-[15px] mb-[7.59px] mt-[22px] ${formData.firstName ? "text-gray-500" : "text-[#00000040]"
                }`}
            >
              Last Name *
            </Label>
            <Input
              placeholder="Enter Last Name"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${formData.firstName
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
                }`}
              value={formData.lastName}
              onChange={(e) => handleTextInputChange(e, "lastName")}
              onBlur={() => handleBlur("lastName")}
              disabled={!formData.firstName}
            />
            {touched.lastName && !formData.lastName && (
              <span className="text-red-500 text-sm mt-1 block">
                Last Name is required
              </span>
            )}
          </div>

          {/* Primary Mobile Number */}
          <div className="mt-[22px]">
            <Label
              className={`text-[15px] mb-[7.59px] ${formData.lastName ? "text-gray-500" : "text-[#00000040]"
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
                disabled
                className="w-[100px] border-none shadow-none"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "7.26px 0 0 7.26px",
                    borderRightWidth: 0,
                    height: "39px",
                    minHeight: "39px",
                    width: "max-content",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    boxShadow: "none",
                    borderColor: "transparent",
                    "&:hover": {
                      borderColor: "transparent",
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    cursor: "pointer",
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter primary mobile no."
                value={formData.primaryMobileNumber}
                disabled
                className="rounded-[7.26px]  border-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] bg-white placeholder:text-gray-500"
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
            <div className="flex items-center justify-between">
              <Label
                className={`text-[15px]  mb-[7.59px] ${isMobileValid(formData.primaryMobileNumber)
                    ? "text-gray-500"
                    : "text-[#00000040]"
                  }`}
              >
                WhatsApp Number
              </Label>
              <div className="flex gap-[6px] items-center">
                <Checkbox
                  id="sameAsMobile"
                  className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1 cursor-pointer"
                  checked={sameAsMobile}
                  onCheckedChange={(checked) => {
                    setSameAsMobile(checked);
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        whatsappNumber: prev.primaryMobileNumber,
                        countryCode_whatsapp: prev.countryCode_primary,
                      }));
                      setTouched((prev) => ({ ...prev, whatsappNumber: true }));
                    }
                  }}
                  disabled={!isMobileValid(formData.primaryMobileNumber)}
                />
                <label
                  htmlFor="sameAsMobile"
                  className={`cursor-pointer text-[12px] ${isMobileValid(formData.primaryMobileNumber)
                      ? "text-gray-500"
                      : "text-[#00000040]"
                    }`}
                >
                  Same as Mobile Number
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 h-[39px]">
              <Select
                options={countryOptions}
                value={countryOptions.find(
                  (option) => option.value === formData.countryCode_whatsapp
                )}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryCode_whatsapp: selectedOption
                      ? selectedOption.value
                      : "🇮🇳 +91",
                  }))
                }
                isDisabled={
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                }
                className="w-[100px] border-none shadow-none"
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
                        !isMobileValid(formData.primaryMobileNumber)
                        ? "#faf5f8"
                        : "#fff",
                    cursor: "pointer",
                    boxShadow: "none",
                    borderColor: "transparent",
                    "&:hover": {
                      borderColor: "transparent",
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    cursor: "pointer",
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
                placeholder="Enter WhatsApp no."
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange(e, "whatsappNumber")}
                onBlur={() => handleBlur("whatsappNumber")}
                disabled={
                  sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                }
                className={`border rounded-[7.26px] border-l-0 text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 w-full h-[39px] ${sameAsMobile || !isMobileValid(formData.primaryMobileNumber)
                    ? "bg-[#ffffff90] placeholder:text-[#00000040]"
                    : "bg-white placeholder:text-gray-500"
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

          {/* Gender */}
          <div className="mt-[22px]">
            <Label
              className={`text-[15px] mb-[7.59px] ${isMobileValid(formData.primaryMobileNumber)
                  ? "text-gray-500"
                  : "text-[#00000040]"
                }`}
            >
              Gender *
            </Label>
            <div className="flex gap-6 items-center text-gray-600 text-[15px]">
              {["male", "female", "other"].map((value) => (
                <Label key={value} className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={formData.gender === value}
                    onChange={() => handleGenderChange(value)}
                    disabled={!isMobileValid(formData.primaryMobileNumber)}
                    className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4 cursor-pointer"
                  />
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Label>
              ))}
            </div>
            {touched.gender && !formData.gender && (
              <span className="text-red-500 text-sm mt-1 block">
                Gender is required
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <Label
              className={`text-[15px] mb-[7.59px] mt-[22px] text-[#00000040]`}
            >
              Email Address
            </Label>
            <Input
              placeholder="Enter Email address"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${formData.gender
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffffde] placeholder:text-[#00000040]"
                }`}
              value={formData.email}
              disabled
            />
            {touched.email &&
              formData.email &&
              !isEmailValid(formData.email) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid email
                </span>
              )}
          </div>

          {/* Address Details */}
          <div>
            <Label
              className={`text-[15px] mb-[7.59px] mt-[22px] ${formData.gender ? "text-gray-500" : "text-[#00000040]"
                }`}
            >
              Pincode *
            </Label>
            <Input
              placeholder="Enter Pincode"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${formData.gender
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffffde] placeholder:text-[#00000040]"
                }`}
              onChange={(e) => handlePinCodeChange(e.target.value)}
              value={formData.addressDetails.pincode}
              disabled={!formData.gender}
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {touched.addressDetails.pincode &&
              !formData.addressDetails.pincode && (
                <span className="text-red-500 text-sm mt-1 block">
                  PIN code is required
                </span>
              )}
            {touched.addressDetails.pincode &&
              formData.addressDetails.pincode &&
              !isPincodeValid(formData.addressDetails.pincode) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Must be 6 digits
                </span>
              )}
          </div>
          <div>
            <Label
              className={`text-[15px] mb-[7.59px] mt-[22px] ${isPincodeValid(formData.addressDetails.pincode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
                }`}
            >
              Area
            </Label>
            <Input
              placeholder="Enter Area"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${isPincodeValid(formData.addressDetails.pincode)
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff] placeholder:text-[#00000040]"
                }`}
              value={formData.addressDetails.area}
              onChange={(e) =>
                handleTextInputChange(e, "addressDetails", "area")
              }
              onBlur={() => handleBlur("addressDetails.area")}
              disabled={!isPincodeValid(formData.addressDetails.pincode)}
            />
          </div>
          <div>
            <Label
              className={`text-[15px] mb-[7.59px] mt-[22px] ${isPincodeValid(formData.addressDetails.pincode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
                }`}
            >
              City
            </Label>
            <Input
              placeholder="Enter City"
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px]"
              value={formData.addressDetails.city}
              disabled
            />
          </div>
          <div>
            <Label
              className={`text-[15px] mb-[7.59px] mt-[22px] ${isPincodeValid(formData.addressDetails.pincode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
                }`}
            >
              State
            </Label>
            <Input
              placeholder="Enter State"
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px]"
              value={formData.addressDetails.state}
              disabled
            />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] fixed bottom-0 left-0 right-0 flex justify-between gap-3 pb-[23px] px-[22px] max-w-[576px] mx-auto">
          {/* <Button
            className="border border-[#CC627B] bg-transparent text-[#CC627B] text-[14px] font-[600] w-[48%] h-[45px] rounded-[8px]"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button> */}

          <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
            onClick={() => setShow(true)}>
            Cancel
          </Button>
          <Drawer className="pt-[9.97px] max-w-[576px] m-auto"
            open={show}
            onClose={handleClose}>
            <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
              <DrawerHeader>
                <DrawerTitle className="text-[16px] font-[600] text-center">
                  Are you sure
                </DrawerTitle>
                <DrawerDescription className="mt-6 flex gap-3 w-full">
                  <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
                    onClick={() => router.push("/patient/login")}>
                    Confirm
                  </Button>

                  <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
                    onClick={() => handleClose()}>
                    Continue
                  </Button>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="p-0">
                <DrawerClose>
                  <Button
                    variant="outline"
                    className="absolute top-[10px] right-0"
                  >
                    <X className="w-2 h-2 text-black" />
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Button
            className={`text-white text-[14px] font-[600] w-[48%] h-[45px] rounded-[8px] ${isFormValid()
                ? "bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0]"
                : "bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[#FFFFFF] cursor-not-allowed"
              }`}
            onClick={handleSave}
            disabled={!isFormValid()}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PP_Details;