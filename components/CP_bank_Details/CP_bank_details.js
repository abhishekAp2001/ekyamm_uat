"use client";

import React, { useEffect, useState } from "react";
import CP_Header from "@/components/CP_Header/CP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CP_buttons from "@/components/CP_buttons/CP_buttons";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const CP_bank_details = () => {
  const axios = axiosInstance();
  const router = useRouter();

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const [touched, setTouched] = useState({
    ifscCode: false,
    bankName: false,
    accountNumber: false,
    confirmAccountNumber: false,
    accountHolderName: false,
  });

  // Validation functions
  const isIfscValid = (ifsc) => /^[A-Z]{4}0\d{6}$/.test(ifsc);
  const isAccountNumberValid = (account) => /^\d{9,18}$/.test(account);
  const isAccountHolderNameValid = (name) => /^[A-Za-z\s]{3,}$/.test(name);
  const isConfirmAccountNumberValid = () =>
    formData.accountNumber === formData.confirmAccountNumber && formData.accountNumber !== ""
  const isFormValid = () =>
    isIfscValid(formData.ifscCode) &&
    formData.bankName &&
    isAccountNumberValid(formData.accountNumber) &&
    isConfirmAccountNumberValid() &&
    isAccountHolderNameValid(formData.accountHolderName);

  // Load form data from cookie on component mount
  useEffect(() => {
    const savedData = getCookie("cp_bank_details");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Mark fields as touched if they have values
        setTouched({
          ifscCode: !!parsedData.ifscCode,
          bankName: !!parsedData.bankName,
          accountNumber: !!parsedData.accountNumber,
          confirmAccountNumber: !!parsedData.confirmAccountNumber,
          accountHolderName: !!parsedData.accountHolderName,
        });
      } catch (error) {
        console.error("Error parsing cp_bank_details cookie:", error);
      }
    }
  }, []);

  // Fetch bank details by IFSC code
  const fetchBankDetailsByIfsc = async () => {
    try {
      const response = await axios.post(`v2/sales/verify/ifsc`, {
        ifscCode: formData.ifscCode,
      });
      if (response?.data?.success === true) {
        setFormData((prev) => ({
          ...prev,
          bankName: response?.data?.data?.bank,
        }));
        setTouched((prev) => ({ ...prev, bankName: true }));
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setFormData((prev) => ({ ...prev, bankName: "" }));
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(
          error?.response?.data?.error?.message ||
            "Failed to fetch bank details"
        );
      }
    }
  };

  useEffect(() => {
    if (formData?.ifscCode?.length === 11 && isIfscValid(formData.ifscCode)) {
      fetchBankDetailsByIfsc();
    } else {
      setFormData((prev) => ({ ...prev, bankName: "" }));
    }
  }, [formData.ifscCode]);

  // Handle input change
  const handleInputChange = (e, field) => {
    let value = e.target.value;
    if (field === "ifscCode") {
      value = value.toUpperCase().slice(0, 11);
    } else if (field === "accountNumber" || field === "confirmAccountNumber") {
      value = value.replace(/\D/g, "").slice(0, 18);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle blur for input fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle save and continue
  const handleSave = () => {
    if (isFormValid()) {
      setCookie("cp_bank_details", formData);
      handleAddChannelPartner();
    } else {
      showErrorToast("Please fill all required fields correctly");
      // Mark all fields as touched to show errors
      setTouched({
        ifscCode: true,
        bankName: true,
        accountNumber: true,
        confirmAccountNumber: true,
        accountHolderName: true,
      });
    }
  };

  const handleAddChannelPartner = async () => {
    try {
      const cp_type = hasCookie("cp_type")
        ? JSON.parse(getCookie("cp_type"))
        : "";
      const cp_doctor_details = hasCookie("cp_doctor_details")
        ? JSON.parse(getCookie("cp_doctor_details"))
        : "";
      const cp_clinic_details = hasCookie("cp_clinic_details")
        ? JSON.parse(getCookie("cp_clinic_details"))
        : "";
      const cp_billing_details = hasCookie("cp_billing_details")
        ? JSON.parse(getCookie("cp_billing_details"))
        : "";

      const payload = {
        channelPartnerDetails: {
          type: cp_type?.type, // "IVF" / "Fertility Clinic"
          clinicName: cp_type?.clinicName ,
          generalInformation: {
            userName: cp_type?.userName ,
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
            billingEmail: cp_billing_details?.billingEmail, // NOTE: required only for 'monthly' billingType
            billingType: cp_billing_details?.billingType, // "monthly" / "onSpot" / "patientPays"
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
          panCard: cp_billing_details?.panCard,
          gstNumber: cp_billing_details?.gstNumber,
        },
        bankDetails: {
          accountHolderName: formData?.accountHolderName ,
          accountNumber: formData?.accountNumber,
          ifscCode: formData?.ifscCode,
          bankName: formData?.bankName,
        },
      };
      const response = await axios.post(`v2/cp/channelPartner/invite`,payload)
      if(response?.data?.success){
        router.push("/sales")
        showSuccessToast("Profile Created with Unique URL");
        deleteCookie("cp_type");
        deleteCookie("cp_clinic_details");
        deleteCookie("cp_doctor_details");
        deleteCookie("cp_billing_details");
        deleteCookie("cp_bank_details");
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

  return (
    <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col max-w-[576px] mx-auto">
      <CP_Header />
      <div className="h-full pt-[9%] lg:pt-[7%] pb-[12%] overflow-auto px-[17px] mt-3 bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5]">
        <div className="mt-2 lg:mt-0 bg-[#FFFFFF80] rounded-[12px] p-4 px-3">
          <strong className="text-[15px] text-black font-semibold">
            Bank Details
          </strong>
          <div>
            <Label
              htmlFor="ifscCode"
              className="text-[15px] text-gray-500 mb-[7.59px] mt-[22px]"
            >
              IFSC Code *
            </Label>
            <Input
              id="ifscCode"
              type="text"
              placeholder="Add IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange(e, "ifscCode")}
              onBlur={() => handleBlur("ifscCode")}
              className="bg-white rounded-[7.26px] text-[15px]text-black font-semibold placeholder:text-[15px]placeholder:text-gray-500 py-3 px-4 h-[39px]"
            />
            {touched.ifscCode && !formData.ifscCode && (
              <span className="text-red-500 text-sm mt-1 block">
                IFSC code is required
              </span>
            )}
            {touched.ifscCode &&
              formData.ifscCode &&
              !isIfscValid(formData.ifscCode) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid IFSC code (e.g., SBIN0001234)
                </span>
              )}
          </div>
          <div>
            <Label
              htmlFor="bankName"
              className={`text-[15px] mb-[7.59px] mt-[22px] ${
                isIfscValid(formData.ifscCode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              Bank Name *
            </Label>
            <Input
              id="bankName"
              type="text"
              placeholder="Add Bank Name"
              value={formData.bankName}
              disabled
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px]py-3 px-4 h-[39px] ${
                isIfscValid(formData.ifscCode)
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
              }`}
            />
            {touched.bankName && !formData.bankName && (
              <span className="text-red-500 text-sm mt-1 block">
                Bank name is required
              </span>
            )}
          </div>
          <div>
            <Label
              htmlFor="accountNumber"
              className={`text-[15px] mb-[7.59px] mt-[22px] ${
                formData.bankName ? "text-gray-500" : "text-[#00000040]"
              }`}
            >
              Account Number *
            </Label>
            <div className="relative">
              <Input
                id="accountNumber"
                type="text"
                placeholder="Add Account Number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange(e, "accountNumber")}
                onBlur={() => handleBlur("accountNumber")}
                disabled={!formData.bankName}
                className={`rounded-[7.26px] text-[15px]text-black font-semibold placeholder:text-[15px]py-3 px-4 h-[39px] ${
                  formData.bankName
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                }`}
              />
              {touched.accountNumber &&
                isAccountNumberValid(formData.accountNumber) && (
                  <Image
                    src="/images/green_check.png"
                    width={20}
                    height={20}
                    className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                    alt="check"
                  />
                )}
            </div>
            {touched.accountNumber && !formData.accountNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                Account number is required
              </span>
            )}
            {touched.accountNumber &&
              formData.accountNumber &&
              !isAccountNumberValid(formData.accountNumber) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid account number (9-18 digits)
                </span>
              )}
          </div>
          <div>
            <Label
              htmlFor="confirmAccountNumber"
              className={`text-[15px] mb-[7.59px] mt-[22px] ${
                isAccountNumberValid(formData.accountNumber)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              Confirm Account Number *
            </Label>
            <div className="relative">
              <Input
                id="confirmAccountNumber"
                type="text"
                placeholder="Enter Confirm Account Number"
                value={formData.confirmAccountNumber}
                onChange={(e) => handleInputChange(e, "confirmAccountNumber")}
                onBlur={() => handleBlur("confirmAccountNumber")}
                disabled={!isAccountNumberValid(formData.accountNumber)}
                className={`rounded-[7.26px] text-[15px]text-black font-semibold placeholder:text-[15px]py-3 px-4 h-[39px] ${
                  isAccountNumberValid(formData.accountNumber)
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                }`}
              />
              {touched.confirmAccountNumber &&
                isConfirmAccountNumberValid() && (
                  <Image
                    src="/images/green_check.png"
                    width={20}
                    height={20}
                    className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                    alt="check"
                  />
                )}
              {touched.confirmAccountNumber &&
                formData.confirmAccountNumber &&
                !isConfirmAccountNumberValid() && (
                  <Image
                    src="/images/error_circle.png"
                    width={20}
                    height={20}
                    className="w-[20.83px] pt-1.5 absolute top-[3px] right-3.5"
                    alt="error"
                  />
                )}
            </div>
            {touched.confirmAccountNumber && !formData.confirmAccountNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                Confirm account number is required
              </span>
            )}
            {touched.confirmAccountNumber &&
              formData.confirmAccountNumber &&
              !isConfirmAccountNumberValid() && (
                <span className="text-red-500 text-sm mt-1 block">
                  Account numbers do not match
                </span>
              )}
          </div>
          <div>
            <Label
              htmlFor="accountHolderName"
              className={`text-[15px] mb-[7.59px] mt-[22px] ${
                isConfirmAccountNumberValid()
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              Account Holder Name *
            </Label>
            <Input
              id="accountHolderName"
              type="text"
              placeholder="Add Account Holder Name"
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange(e, "accountHolderName")}
              onBlur={() => handleBlur("accountHolderName")}
              disabled={
                !(
                  isAccountNumberValid(formData.accountNumber) &&
                  isConfirmAccountNumberValid()
                )
              }
              className={`rounded-[7.26px] text-[15px]text-black font-semibold placeholder:text-[15px]py-3 px-4 h-[39px] ${
                isConfirmAccountNumberValid()
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff90] placeholder:text-[#00000040]"
              }`}
            />
            {touched.accountHolderName && !formData.accountHolderName && (
              <span className="text-red-500 text-sm mt-1 block">
                Account holder name is required
              </span>
            )}
            {touched.accountHolderName &&
              formData.accountHolderName &&
              !isAccountHolderNameValid(formData.accountHolderName) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid name (letters and spaces, min 3 characters)
                </span>
              )}
          </div>
        </div>
        <CP_buttons
          disabled={!isFormValid()}
          onSave={handleSave}
          buttonText="Send Invite"
        />
      </div>
    </div>
  );
};

export default CP_bank_details;
