"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import PP_Header from "../PP_Header/PP_Header";
import { getCookie, setCookie } from "cookies-next";
import { showErrorToast } from "@/lib/toast";
import { sanitizeInput } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Baseurl } from "@/lib/constants";
import Select from "react-select";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
polyfillCountryFlagEmojis();

const PP_Details = ({ type }) => {
  const router = useRouter();
  const customAxios = axiosInstance();
  const [patientData, setPatientData] = useState(null);
  const [user, setUser] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [sameAsMobile, setSameAsMobile] = useState(false);

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

  const [touched, setTouched] = useState({
    type: false,
    clinicName: false,
    userName: false,
    email: false,
    primaryMobileNumber: false,
    whatsappNumber: false,
    emergencyNumber: false,
  });
  const countryOptions = useMemo(
    () =>
      countryList.map((country) => ({
        value: `${country.flag} ${country.code}`,
        label: `${country.flag} ${country.code}`,
        name: country.name,
      })),
    [countryList]
  );
  const [mobile, setMobile1] = useState("");
  const [selected, setSelected] = useState({
    code: "+91",
    name: "India",
    flag: "/images/india.png",
  });
  const [open, setOpen] = useState(false);

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

  const isDisabled = true;

  useEffect(() => {
    const userCookie = getCookie("userData");
    if (!userCookie) {
      router.push(`/patient/${type}/create/password`);
      return;
    }
    const patientData = JSON.parse(userCookie);
    setPatientData(patientData);

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

    const getPatient = async (patientId, entityId) => {
      try {
        const token  ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ4YzhhYTlkYWU2YTZjN2U4ZDk3N2MiLCJlbWFpbCI6ImNoaW50ZW5AZWt5YW1tLmNvbSIsInVzZXJUeXBlIjoic3VwZXJBZG1pbiIsImlhdCI6MTcxNzA1NDE3NiwiZXhwIjoxNzE3MDk3Mzc2fQ.ZKsjdo6PaDKj-3MdQ6Hg4uYvwG657O-3c0Flb_R3Np0";
        const response = await axios.get(Baseurl + "/v2/patient/" + patientId, {
          params: {
            type: "patient",
          },
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            entityId: entityId,
          },
        });
        if (response?.data?.success) {
          setUser(response?.data?.data);
        }
      } catch (err) {
        console.log('err',err);
        
        showErrorToast(
          err?.response?.data?.error?.message || "Error during sign-in"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyChannelPartner(type);
    const patientId = "66a10a19c8ca863d98b3ee01";
    const entityId = "66cb61aaf3252d4ff3e9badd";
    getPatient(patientId, entityId);
  }, [type]);

  const getCountryList = async () => {
    try {
      const response = await customAxios.get(`v2/country?search=${""}`);
      if (response?.data?.success === true) {
        setCountryList(response?.data?.data);
      }
    } catch (error) {
      console.log("11error", error);
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

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <PP_Header />
      <div className="h-full pb-[26%] overflow-auto px-[17px]">
        {/* Profile Section */}
        <div className="flex justify-center w-[140.8px] mx-auto relative mb-6">
          <Image
            src="/images/profile.png"
            width={100}
            height={90}
            className="w-full h-fit"
            alt="profile"
          />
          <Drawer>
            <DrawerTrigger>
              <Image
                src="/images/camera.png"
                width={31}
                height={31}
                className="w-[31px] h-fit absolute bottom-[-10px] right-[-10px]"
                alt="camera"
              />
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] rounded-t-[16px]">
              <DrawerHeader>
                <DrawerTitle className="sr-only">Choose Photo</DrawerTitle>
                <DrawerDescription className="flex flex-col gap-3">
                  {["Take Photo", "Choose Photo", "Delete Photo"].map(
                    (text, idx) => (
                      <Button
                        key={idx}
                        className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px] rounded-[8.16px]"
                      >
                        <Link href="">{text}</Link>
                        <Image
                          src="/images/arrow.png"
                          width={24}
                          height={24}
                          alt="arrow"
                        />
                      </Button>
                    )
                  )}
                </DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Form */}
        <div className="rounded-[12px]">
          {/* First Name */}
          <Label className="text-[15px] text-gray-500 mb-[7.59px] mt-5">
            First Name *
          </Label>
          <Input
            placeholder="Enter first name"
            className="bg-white rounded-[7.26px] text-[15px] font-semibold  w-full h-[38px]"
          />

          {/* Last Name */}
          <Label className="text-[15px] text-gray-500 mb-[7.59px] mt-[22px]">
            Last Name
          </Label>
          <Input
            placeholder="Enter last name"
            className="w-full bg-white rounded-[7.26px] text-[15px] font-semibold h-[39px]"
          />

          <div className="mt-[22px]">
            <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
              Primary Mobile Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 h-[39px]">
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
                disabled={false}
                className="w-fit border-none shadow-none"
                styles={{
                  control: (base) => ({
                    ...base,
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
                id="primaryMobileNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                placeholder="Enter primary mobile no."
                value={formData.primaryMobileNumber}
                onChange={(e) => handleInputChange(e, "primaryMobileNumber")}
                onBlur={() => handleBlur("primaryMobileNumber")}
                disabled={false}
                className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-gray-500 font-semibold py-2 px-4 h-[38px] w-full"
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
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[8px]">
                Whatsapp Number
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
                  className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1"
                />
                <label
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
            <div className="flex items-center gap-2 h-[39px]">
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
                className="w-fit border-none shadow-none bg-white"
                styles={{
                  control: (base) => ({
                    ...base,
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
                id="whatsappNumber"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter whatsapp no."
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange(e, "whatsappNumber")}
                onBlur={() => handleBlur("whatsappNumber")}
                className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-gray-500 font-semibold py-2 px-4 h-[38px] w-full"
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

          {/* Gender */}
          <div className="flex flex-col mb-4 mt-[24px]">
            <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px]">
              Gender <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-6 items-center text-gray-600 text-[15px]">
              <Label className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="gender"
                  value="male"
                  className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4"
                />
                Male
              </Label>

              <Label className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="gender"
                  value="female"
                  className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4"
                />
                Female
              </Label>
              <Label className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="gender"
                  value="other"
                  className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4"
                />
                Other
              </Label>
            </div>
          </div>

          {/* Email */}
          <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
            Email Address
          </Label>
          <Input
            placeholder="Enter Email address"
            className="w-full bg-white rounded-[7.26px] text-[15px] font-semibold h-[39px]"
          />

          {/* Address Fields */}
          {[
            { label: "Pincode", required: true },
            { label: "Area" },
            { label: "City" },
            { label: "State" },
          ].map(({ label, required }) => (
            <div key={label}>
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                placeholder={`Enter ${label} name`}
                className="w-full bg-white rounded-[7.26px] text-[15px] font-semibold h-[39px]"
              />
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] fixed bottom-0 left-0 right-0 flex justify-between gap-3 pb-[23px] px-4 max-w-[576px] mx-auto">
          <Button className="border border-[#CC627B] bg-transparent text-[#CC627B] text-[15px] font-[600] w-[48%] h-[45px] rounded-[8px]">
            Cancel
          </Button>
          <Link
            href={"/patient-registration/family-details"}
            className="w-[48%]"
          >
            <Button className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[15px] font-[600] w-full h-[45px] rounded-[8px]">
              Save & Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PP_Details;
