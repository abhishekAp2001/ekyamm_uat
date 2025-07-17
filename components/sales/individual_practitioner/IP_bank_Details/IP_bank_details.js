"use client";

import React, { useEffect, useState } from "react";
import CP_Header from "@/components/sales/channel_partner/CP_Header/CP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CP_buttons from "@/components/sales/channel_partner/CP_buttons/CP_buttons";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import IP_Header from "../IP_Header/IP_Header";
import IP_Buttons from "../IP_Buttons/IP_Buttons";
import { Button } from "../../../ui/button";
import { base64ToFile } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../../ui/drawer";
import { X } from "lucide-react";

const IP_bank_details = () => {
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

  const [isLoading, setIsLoading] = useState(false);

  const [show,setShow] = useState(false)
    const handleClose = () =>{
      setShow(false)
    }

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
    const savedData = localStorage.getItem("ip_bank_details");
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
    if (formData?.ifscCode?.length === 11 && isIfscValid(formData?.ifscCode)) {
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
      localStorage.setItem("ip_bank_details", JSON.stringify(formData));
      handleAddIndividualPractitioner();
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

  const uploadImage = async (filename, type) => {
    try {
      const file = base64ToFile(filename, "myImage.png");
      const form = new FormData();
      form.append("filename", file);
      const response = await axios.post(`v2/psychiatrist/uploadImage`, form);
      if (response?.data?.success) {
        const imageUrl = response?.data?.image;
        // Save to localStorage based on type
        if (type === "profile") {
          localStorage.setItem("profileImageUrl", imageUrl);
        } else if (type === "certificates") {
          let existingCertificates =
            JSON.parse(localStorage.getItem("certificates")) || [];
          existingCertificates.push(imageUrl);
          localStorage.setItem(
            "certificates",
            JSON.stringify(existingCertificates)
          );
        }
        return imageUrl;
      }
    } catch (error) {
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(error?.response?.data?.error?.message);
      }
      return null;
    }
  };

  const handleAddIndividualPractitioner = async () => {
    setIsLoading(true);
    try {
      const ip_details = JSON.parse(localStorage.getItem("ip_details"));
      const ip_medical_association_details = JSON.parse(
        localStorage.getItem("ip_medical_association_details")
      );
      const ip_general_information = JSON.parse(
        localStorage.getItem("ip_general_information")
      );
      const ip_single_session_fees = JSON.parse(
        localStorage.getItem("ip_single_session_fees")
      );

      // Check for existing profile image URL in localStorage
      let profileImageUrl = localStorage.getItem("profileImageUrl") || "";
      if (ip_details?.profileImageBase64 && !profileImageUrl) {
        profileImageUrl =
          (await uploadImage(ip_details?.profileImageBase64, "profile")) || "";
      }

      // Check for existing certificates in localStorage
      let certificates = JSON.parse(localStorage.getItem("certificates")) || [];
      if (
        ip_medical_association_details?.certificates?.length > 0 &&
        certificates.length === 0
      ) {
        const uploadPromises = ip_medical_association_details.certificates.map(
          (element) => uploadImage(element?.base64, "certificates")
        );
        certificates = (await Promise.all(uploadPromises)).filter(Boolean);
      }

      const packages = ip_single_session_fees?.packages
        ?.filter((item) => item?.enabled)
        .map((item) => {
          return {
            sessions: item?.sessions,
            rate: Number(item?.rate),
          };
        });

      const payload = {
        practitionerDetails: {
          generalInformation: {
            profileImageUrl: profileImageUrl, // Optional - same as entityDetails.logoUrl
            firstName: ip_details?.firstName,
            lastName: ip_details?.lastName,
            email: ip_details?.email,
            countryCode_primary: ip_details?.countryCode_primary,
            primaryMobileNumber: ip_details?.primaryMobileNumber,
            countryCode_whatsapp: ip_details?.countryCode_whatsapp,
            whatsappNumber: ip_details?.whatsappNumber,
            countryCode_emergency: ip_details?.countryCode_emergency,
            emergencyNumber: ip_details?.emergencyNumber,
            residentialAddress: ip_general_information?.address||"", // Optional
            googleMapAddress: ip_general_information?.googleMapAddress||"", // Optional
          },
          practiceDetails: {
            logoUrl: profileImageUrl,
            yearsOfExperience: ip_general_information?.yearsOfExperience,
            specialization: ip_general_information?.specialization,
            whatIDontTreat: ip_general_information?.whatIDontTreat,
            whatToExpectInSession:
              ip_general_information?.whatToExpectInSession,
            languageProficiency: ip_general_information?.languageProficiency, // Fetch launguage options from Local V2 > Sales > Get languages API
            // Medical Association Details
            medicalAssociations: [
              {
                name: ip_medical_association_details?.name,
                medicalAssociationNumber:
                  ip_medical_association_details?.medicalAssociationNumber,
                certificates: certificates,
              },
            ],
            address: ip_general_information?.address, // Same as generalInformation.address
            googleMapAddress: ip_general_information?.googleMapAddress, // Same as generalInformation.googleMapAddress
            fees: {
              singleSession: Number(ip_single_session_fees?.singleSession),
              packages: packages,
            },
          },
        },
        entityDetails: {
          type: "practice", // Static field for Individual-Practitioner form (Do not change)
          logoUrl: profileImageUrl, // Optional - same as generalInformation.profileImageUrl
          entityLocations: [
            {
              default: true, // Static field (Do not change)
              // Contact details (copy below 9 fields from practitionerDetails.generalInformation
              email: ip_details?.email,
              countryCode_primary: ip_details?.countryCode_primary,
              primaryMobileNumber: ip_details?.primaryMobileNumber,
              countryCode_whatsapp: ip_details?.countryCode_whatsapp,
              whatsappNumber: ip_details?.whatsappNumber,
              countryCode_emergency: ip_details?.countryCode_emergency,
              emergencyNumber: ip_details?.emergencyNumber,
              address: "", // Optional (just change the field name from "residentialAddress" > "address")
              googleMapAddress: "", // Optional
            },
          ],
        },
        kycDetails: {
          panCard: ip_single_session_fees?.panCard,
          gstNumber: ip_single_session_fees?.gstNumber,
        },
        bankDetails: {
          accountHolderName: formData?.accountHolderName,
          accountNumber: formData?.accountNumber,
          ifscCode: formData?.ifscCode,
          bankName: formData?.bankName,
        },
      };
      // console.log("payload", payload);
      const response = await axios.post(
        `v2/sales/invite/individualPractitioner`,
        payload
      );
      if (response?.data?.success) {
        localStorage.removeItem("ip_details");
        localStorage.removeItem("ip_bank_details");
        localStorage.removeItem("ip_general_information");
        localStorage.removeItem("ip_medical_association_details");
        localStorage.removeItem("ip_single_session_fees");
        router.push("/sales");
        showSuccessToast("Invite Sent");
      }
    } catch (error) {
      console.error("Error Adding Individual Practitioner:", error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(error?.response?.data?.error?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/sales");
    localStorage.removeItem("ip_details");
    localStorage.removeItem("ip_bank_details");
    localStorage.removeItem("ip_general_information");
    localStorage.removeItem("ip_medical_association_details");
    localStorage.removeItem("ip_single_session_fees");
  };
  useEffect(() => {
    const token = hasCookie("user") ? JSON.parse(getCookie("user")) : null
    const ip_type_token = localStorage.getItem("ip_single_session_fees") ? JSON.parse(localStorage.getItem("ip_single_session_fees")) : null
    if (!token) {
      router.push('/login')
    }
    else if (!ip_type_token) {
      router.push('/sales/ip_single_session_fees')
    }
  }, [])
  return (
    // <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col">
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <IP_Header text="Add Individual Practitioner Details" />
      <div className="h-full pb-[23%] lg:pb-[16%] overflow-auto px-4 bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
        <div className=" bg-[#FFFFFF60] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">
            Bank Details
          </strong>
          <div>
            <Label
              htmlFor="ifscCode"
              className="text-[15px] text-gray-500 mb-[7.59px] mt-[18px]"
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
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-gray-500 py-3 px-4 h-[39px]"
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
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
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
                className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
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
                className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
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
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
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
        <div className=" bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
          {/* <Button
            className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
            onClick={() => {
              handleCancel();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button> */}

           <Drawer open={show} onClose={()=>handleClose()} className="pt-[9.97px] max-w-[576px] m-auto">
          <DrawerTrigger onClick={()=>setShow(true)} className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
            Cancel
          </DrawerTrigger>
          <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
            <DrawerHeader>
              <DrawerTitle className="text-[16px] font-[600] text-center">
                By cancelling, you are confirming to not add this partner to be part of Ekyamm
              </DrawerTitle>
              <DrawerDescription className="mt-6 flex gap-3 w-full">
                <Button onClick={()=>handleCancel()} className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                  Confirm
                </Button>

                <Button onClick={()=>handleClose()} className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                  Continue
                </Button>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="p-0">
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
          <Button
            disabled={!isFormValid() || isLoading}
            onClick={() => {
              handleSave();
            }}
            className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending Invite...
              </div>
            ) : (
              "Send Invite"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IP_bank_details;
