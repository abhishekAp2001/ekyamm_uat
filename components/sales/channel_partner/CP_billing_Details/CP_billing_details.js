"use client";

import React, { useEffect, useState } from "react";
import CP_Header from "@/components/sales/channel_partner/CP_Header/CP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CP_buttons from "@/components/sales/channel_partner/CP_buttons/CP_buttons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRememberMe } from "@/app/context/RememberMeContext";
import { getStorage, removeStorage, setStorage } from "@/lib/utils";

const CP_billing_details = () => {
  const {rememberMe} = useRememberMe()
  const router = useRouter();
  const axios = axiosInstance();
  const [formData, setFormData] = useState({
    billingEmail: "",
    billingType: "", // "monthly" / "onSpot" / "patientPays"
    panCard: "",
    gstNumber: "",
    gstStateCode: "27", // Default state code
    gstSuffix: "",
  });

  const [touched, setTouched] = useState({
    billingEmail: false,
    billingType: false,
    panCard: false,
    gstNumber: false,
  });

  // Validation functions
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPanCardValid = (pan) => /^[A-Z]{5}\d{4}[A-Z]$/.test(pan);
  const isGstNumberValid = (gst) =>
    /^[0-9]{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]{3}$/.test(gst);
  const isFormValid = () =>
    formData.billingType &&
    formData.panCard &&
    isPanCardValid(formData.panCard) &&
    formData.gstNumber &&
    isGstNumberValid(formData.gstNumber) &&
    (formData.billingType !== "monthly" ||
      (formData.billingEmail && isEmailValid(formData.billingEmail)));

  // Load form data from cookie on component mount
  useEffect(() => {
    // const savedData = getCookie("cp_billing_details");
    const savedData = getStorage("cp_billing_details", rememberMe);
    if (savedData) {
      try {
        const parsedData = savedData;
        // Extract gstStateCode and gstSuffix from gstNumber
        if (parsedData.gstNumber && isGstNumberValid(parsedData.gstNumber)) {
          parsedData.gstStateCode = parsedData.gstNumber.slice(0, 2);
          parsedData.gstSuffix = parsedData.gstNumber.slice(-3);
        }
        setFormData(parsedData);
        // Mark fields as touched if they have values
        setTouched({
          billingEmail: !!parsedData.billingEmail,
          billingType: !!parsedData.billingType,
          panCard: !!parsedData.panCard,
          gstNumber: !!parsedData.gstNumber,
        });
      } catch (error) {
        console.error("Error parsing cp_billing_details cookie:", error);
      }
    }
  }, []);

  // Handle input change for text fields
  const handleTextInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Handle PAN card input (uppercase, max 10 characters)
  const handlePanCardChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 10);
    setFormData((prev) => ({ ...prev, panCard: value }));
  };

  // Handle GST number components
  const handleGstStateCodeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gstStateCode: value,
      gstNumber: value + prev.panCard + prev.gstSuffix,
    }));
  };

  const handleGstSuffixChange = (e) => {
    const suffix = e.target.value.toUpperCase().slice(0, 3);
    setFormData((prev) => ({
      ...prev,
      gstSuffix: suffix,
      gstNumber: prev.gstStateCode + prev.panCard + suffix,
    }));
  };

  // Handle blur for input fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle send invite for monthly billing
  const handleAddChannelPartner = async () => {
    try {
      // const cp_type = hasCookie("cp_type")
      //   ? JSON.parse(getCookie("cp_type"))
      //   : "";
      // const cp_doctor_details = hasCookie("cp_doctor_details")
      //   ? JSON.parse(getCookie("cp_doctor_details"))
      //   : "";
      // const cp_clinic_details = hasCookie("cp_clinic_details")
      //   ? JSON.parse(getCookie("cp_clinic_details"))
      //   : "";
      const cp_type = getStorage("cp_type", rememberMe);
      const cp_doctor_details = getStorage("cp_doctor_details", rememberMe);
      const cp_clinic_details = getStorage("cp_clinic_details", rememberMe);
      if(!cp_type || !cp_doctor_details || !cp_clinic_details){
        router.push('/login')
      }
      const payload = {
        channelPartnerDetails: {
          type: cp_type?.type, // "IVF" / "Fertility Clinic"
          clinicName: cp_type?.clinicName,
          generalInformation: {
            userName: cp_type?.userName,
            // "profileImageUrl": "",
            // "firstName": "Channel2",
            // "lastName": "Partner2",
            email: cp_type?.email,
            countryCode_primary: cp_type?.countryCode_primary,
            primaryMobileNumber: cp_type?.primaryMobileNumber,
            countryCode_whatsapp: cp_type?.countryCode_whatsapp,
            whatsappNumber: cp_type?.whatsappNumber,
            countryCode_emergency: cp_type?.countryCode_emergency,
            emergencyNumber: cp_type?.emergencyNumber,
            // Clinic address
            // "address": "",
            pincode: cp_clinic_details?.pincode,
            area: cp_clinic_details?.area,
            city: cp_clinic_details?.city,
            state: cp_clinic_details?.state,
            // Billing details
            billingEmail: formData?.billingEmail, // NOTE: required only for 'monthly' billingType
            billingType: formData?.billingType, // "monthly" / "onSpot" / "patientPays"
          },
          doctorDetails: {
            doNotDisplay: cp_doctor_details?.doNotDisplay, // true / false (boolean)
            firstName: cp_doctor_details?.firstName, // Salutation + firstname
            lastName: cp_doctor_details?.lastName,
            email: cp_doctor_details?.email,
            countryCode_primary: cp_doctor_details?.countryCode_primary,
            primaryMobileNumber: cp_doctor_details?.primaryMobileNumber,
            countryCode_whatsapp: cp_doctor_details?.countryCode_whatsapp,
            whatsappNumber: cp_doctor_details?.whatsappNumber,
            countryCode_emergency: cp_doctor_details?.countryCode_emergency,
            emergencyNumber: cp_doctor_details?.emergencyNumber,
          },
        },
        kycDetails: {
          panCard: formData?.panCard,
          gstNumber: formData?.gstNumber,
        },
        bankDetails: {
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
        },
      };
      const response = await axios.post(`v2/cp/channelPartner/invite`, payload);
      if (response?.data?.success) {
        router.push("/sales");
        showSuccessToast("Profile Created with Unique URL");
        // deleteCookie("cp_type");
        // deleteCookie("cp_clinic_details");
        // deleteCookie("cp_doctor_details");
        // deleteCookie("cp_billing_details");
        // deleteCookie("cp_bank_details");
        removeStorage("cp_type",rememberMe)
        removeStorage("cp_clinic_details",rememberMe)
        removeStorage("cp_doctor_details",rememberMe)
        removeStorage("cp_billing_details",rememberMe)
        removeStorage("cp_bank_details",rememberMe)
      }
    } catch (error) {
      console.error("Error Adding Channel Partner:", error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(error?.response?.data?.error?.message);
      }
    }
  };

  // Handle save and continue
  const handleSave = () => {
    let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
    if (isFormValid()) {
      if (formData.billingType === "monthly") {
        // setCookie("cp_billing_details", formData,maxAge);
        setStorage("cp_billing_details", formData, rememberMe, 43200);
        handleAddChannelPartner();
      } else {
        // setCookie("cp_billing_details", formData,maxAge);
        setStorage("cp_billing_details", formData, rememberMe, 43200);
        router.push("/sales/cp_bank_details");
      }
    } else {
      setTouched({
        billingEmail: formData.billingType === "monthly",
        billingType: true,
        panCard: true,
        gstNumber: true,
      });
    }
  };

        useEffect(()=>{
          // const token = hasCookie("user") ? JSON.parse(getCookie("user")): null
          const token = getStorage("user", rememberMe);
          // const cp_type_token = hasCookie("cp_doctor_details") ? JSON.parse(getCookie("cp_doctor_details")) : null
          const cp_type_token = getStorage("cp_doctor_details", rememberMe);
          if(!token){
            router.push('/login')
          }
          else if(!cp_type_token){
            router.push('/sales/cp_doctor_details')
          }
        },[])
  return (
    <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col max-w-[576px] mx-auto">
      <CP_Header />
      <div className="h-full pt-[9%] pb-[21%] lg:pb-[12%] overflow-auto px-[17px] mt-3 bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5]">
        <div className="mt-3 lg:mt-0 bg-[#FFFFFF80] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">
            Billing Details
          </strong>
          <div className="mt-3">
            <Label className="text-[15px] text-gray-500">Billing Type *</Label>
            <RadioGroup
              value={formData.billingType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, billingType: value }))
              }
              onBlur={() => handleBlur("billingType")}
              className="mt-[10px]"
            >
              <div className="flex items-center gap-[10px]">
                <RadioGroupItem
                  value="monthly"
                  id="r1"
                  className=" "
                />
                <Label htmlFor="r1" className="text-[15px] font-semibold cursor-pointer">
                  Monthly Billing
                </Label>
              </div>
              <div className="flex items-center gap-[10px] my-1">
                <RadioGroupItem
                  value="onSpot"
                  id="r2"
                  className=" "
                />
                <Label htmlFor="r2" className="text-[15px] font-semibold cursor-pointer">
                  On-Spot Payment
                </Label>
              </div>
              <div className="flex items-center gap-[10px]">
                <RadioGroupItem
                  value="patientPays"
                  id="r3"
                  className=""
                />
                <Label htmlFor="r3" className="text-[15px] font-semibold cursor-pointer">
                  Patient Pays
                </Label>
              </div>
            </RadioGroup>
            {touched.billingType && !formData.billingType && (
              <span className="text-red-500 text-sm mt-1 block">
                Billing type is required
              </span>
            )}
            {formData.billingType === "monthly" && (
              <div className="mt-[22px]">
                <Label
                  htmlFor="billingEmail"
                  className={`text-[15px] mb-2 ${
                    formData.billingType ? "text-gray-500" : "text-[#00000040]"
                  }`}
                >
                  Accounts Payable *
                </Label>
                <Input
                  id="billingEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.billingEmail}
                  onChange={(e) => handleTextInputChange({ ...e, target: { ...e.target, value: e.target.value.toLowerCase() } }, "billingEmail")}
                  onBlur={() => handleBlur("billingEmail")}
                  disabled={!formData.billingType}
                  className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                    formData.billingType
                      ? "bg-white placeholder:text-gray-500"
                      : "bg-[#ffffff90] placeholder:text-[#00000040]"
                  }`}
                />
                {touched.billingEmail && !formData.billingEmail && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Email is required
                  </span>
                )}
                {touched.billingEmail &&
                  formData.billingEmail &&
                  !isEmailValid(formData.billingEmail) && (
                    <span className="text-red-500 text-sm mt-1 block">
                      Invalid email
                    </span>
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 bg-[#FFFFFF80] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">KYC</strong>
          <div className="mt-5">
            <Label
              htmlFor="panCard"
              className={`text-[15px] mb-2 ${
                formData.billingType ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              PAN No. *
            </Label>
            <Input
              id="panCard"
              type="text"
              placeholder="Enter your PAN no."
              value={formData.panCard}
              onChange={handlePanCardChange}
              onBlur={() => handleBlur("panCard")}
              disabled={!formData.billingType}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
                formData.billingType
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
              }`}
              maxLength={10}
            />
            {touched.panCard && !formData.panCard && (
              <span className="text-red-500 text-sm mt-1 block">
                PAN number is required
              </span>
            )}
            {touched.panCard &&
              formData.panCard &&
              !isPanCardValid(formData.panCard) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid PAN number (e.g., ABCDE1234F)
                </span>
              )}
          </div>
          <div className="mt-5">
            <Label
              htmlFor="gstNumber"
              className={`text-[15px] mb-2 block ${
                isPanCardValid(formData.panCard)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              GST No. *
            </Label>
            <div className="flex items-center bg-white rounded-l-[7.26px] overflow-hidden h-[39px]">
              <Select
                value={formData.gstStateCode}
                onValueChange={handleGstStateCodeChange}
                onOpenChange={(open) => !open && handleBlur("gstNumber")}
                disabled={!isPanCardValid(formData.panCard)}
              >
                <SelectTrigger
                  className={`w-[60px] rounded-l-[7.26px] rounded-r-none  text-[15px] font-semibold h-[39px] px-2 ${
                    isPanCardValid(formData.panCard)
                      ? "bg-white text-gray-500"
                      : "bg-[#ffffff90] text-[#00000040]"
                  }`}
                >
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 38 }, (_, i) => {
                    const value = (i + 1).toString().padStart(2, "0");
                    return (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <input
                type="text"
                value={formData.panCard}
                readOnly
                className="bg-[#cecece] border-l border-r text-[15px] font-semibold py-3 h-[39px] px-2 text-gray-500 outline-none w-[180px]"
              />
              <input
                type="text"
                value={formData.gstSuffix}
                onChange={handleGstSuffixChange}
                onBlur={() => handleBlur("gstNumber")}
                disabled={!isPanCardValid(formData.panCard)}
                placeholder="Z5G"
                className={`text-[14px] font-semibold px-2 text-black outline-none w-[70px] ${
                  isPanCardValid(formData.panCard)
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                }`}
                maxLength={3}
              />
            </div>
            {touched.gstNumber && !formData.gstNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                GST number is required
              </span>
            )}
            {touched.gstNumber &&
              formData.gstNumber &&
              !isGstNumberValid(formData.gstNumber) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid GST number (e.g., 27ABCDE1234FZ5G)
                </span>
              )}
          </div>
        </div>
        <CP_buttons
          disabled={!isFormValid()}
          onSave={handleSave}
          buttonText={
            formData.billingType === "monthly"
              ? "Send Invite"
              : "Save & Continue"
          }
        />
      </div>
    </div>
  );
};

export default CP_billing_details;
