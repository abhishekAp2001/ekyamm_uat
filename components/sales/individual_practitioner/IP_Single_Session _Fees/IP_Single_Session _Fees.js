"use client";
import React, { useState, useEffect } from "react";
import IP_Header from "../IP_Header/IP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import IP_Buttons from "../IP_Buttons/IP_Buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { showErrorToast } from "@/lib/toast";
import { getCookie, hasCookie } from "cookies-next";
import { useRememberMe } from "@/app/context/RememberMeContext";

const IP_Single_Session_Fees = () => {
  const { rememberMe } = useRememberMe()
  const router = useRouter();
  const [dontHaveGst, setDontHaveGst] = useState(false);
  useEffect(() => {
    const doNotHaveGST = rememberMe ? (localStorage.getItem("doNotHaveGST")==="true") : (sessionStorage.getItem("doNotHaveGST")==="true")
    if (doNotHaveGST) {
      setDontHaveGst(doNotHaveGST)
    }
  }, [rememberMe])
  const [formData, setFormData] = useState({
    singleSession: "",
    packages: [
      { sessions: 4, rate: "", enabled: false },
      { sessions: 8, rate: "", enabled: false },
      { sessions: 12, rate: "", enabled: false },
    ],
    panCard: "",
    gstNumber: "",
    gstStateCode: "27", // Default state code
    gstSuffix: "",
  });

  const [touched, setTouched] = useState({
    singleSession: false,
    panCard: false,
    gstNumber: false,
  });

  // Validation functions
  const isAmountValid = (amount) => /^\d+$/.test(amount) && parseInt(amount) > 0;
  const isPanValid = (pan) => /^[A-Z]{5}\d{4}[A-Z]$/.test(pan);
  const isGstValid = (gst) => /^[0-9]{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]{3}$/.test(gst);
  const isFormValid = () =>
    isAmountValid(formData.singleSession) &&
    isPanValid(formData.panCard) &&
    (dontHaveGst || isGstValid(formData.gstNumber));

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = rememberMe ? localStorage.getItem("ip_single_session_fees") : sessionStorage.getItem("ip_single_session_fees")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Extract gstStateCode and gstSuffix from gstNumber
        if (parsedData.gstNumber && isGstValid(parsedData.gstNumber)) {
          parsedData.gstStateCode = parsedData.gstNumber.slice(0, 2);
          parsedData.gstSuffix = parsedData.gstNumber.slice(-3);
        }
        setFormData({
          singleSession: parsedData.singleSession || "",
          packages: parsedData.packages || [
            { sessions: 4, rate: "", enabled: false },
            { sessions: 8, rate: "", enabled: false },
            { sessions: 12, rate: "", enabled: false },
          ],
          panCard: parsedData.panCard || "",
          gstNumber: parsedData.gstNumber || "",
          gstStateCode: parsedData.gstStateCode || "27",
          gstSuffix: parsedData.gstSuffix || "",
        });
        setTouched({
          singleSession: !!parsedData.singleSession,
          panCard: !!parsedData.panCard,
          gstNumber: !!parsedData.gstNumber,
        });
      } catch (error) {
        console.error("Error parsing ip_single_session_fees from localStorage:", error);
      }
    }
  }, []);

  // Handle input change for single session fee
  const handleSingleSessionChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, singleSession: value }));
    handleBlur("singleSession");
  };

  // Handle package session checkbox and rate
  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => {
      const newPackages = [...prev.packages];
      if (field === "enabled") {
        newPackages[index].enabled = value;
        if (!value) {
          newPackages[index].rate = "";
        }
      } else {
        newPackages[index].rate = value.replace(/\D/g, "");
      }
      return { ...prev, packages: newPackages };
    });
    handleBlur("packages");
  };

  // Handle PAN card input
  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      panCard: value,
      gstNumber: prev.gstStateCode + value + prev.gstSuffix,
    }));
    handleBlur("panCard");
  };

  // Handle GST number components
  const handleGstStateCodeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gstStateCode: value,
      gstNumber: value + prev.panCard + prev.gstSuffix,
    }));
    handleBlur("gstNumber");
  };

  const handleGstSuffixChange = (e) => {
    const suffix = e.target.value.toUpperCase().slice(0, 3);
    setFormData((prev) => ({
      ...prev,
      gstSuffix: suffix,
      gstNumber: prev.gstStateCode + prev.panCard + suffix,
    }));
    handleBlur("gstNumber");
  };

  // Handle blur for input fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle save and continue
  const handleSave = async () => {
    if (isFormValid()) {
      try {
        if (rememberMe) {
          localStorage.setItem("ip_single_session_fees", JSON.stringify(formData));
          localStorage.setItem("doNotHaveGST", !!dontHaveGst);
        }
        else {
          sessionStorage.setItem("doNotHaveGST", !!dontHaveGst);
          sessionStorage.setItem("ip_single_session_fees", JSON.stringify(formData));
        }
        router.push("/sales/ip_bank_details");
      } catch (error) {
        console.error("Error saving data:", error);
        showErrorToast("Failed to save details");
      }
    } else {
      setTouched({
        singleSession: true,
        panCard: true,
        gstNumber: true,
      });
      showErrorToast("Please fill all required fields correctly");
    }
  };

  useEffect(() => {
    const token = hasCookie("user") ? JSON.parse(getCookie("user")) : null
    const raw = rememberMe ? localStorage.getItem("ip_medical_association_details") : sessionStorage.getItem("ip_medical_association_details")
    const doNotHaveMedicalAssociation = rememberMe ? (localStorage.getItem("doNotHaveMedicalAssociation")==="true") : (sessionStorage.getItem("doNotHaveMedicalAssociation")==="true")
    const ip_type_token = raw ? JSON.parse(raw) : null
    if (!token) {
      router.push('/login')
    }
    else if (!ip_type_token) {
      if (doNotHaveMedicalAssociation) {
        return
      }
      else {
        router.push('/sales/ip_medical_association_details')
      }
    }
  }, [])
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <IP_Header text="Add Individual Practitioner Details" />
      <div className="h-full pt-[15%] md:pt-[10%] pb-[22%] overflow-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
        {/* Single Session Fees */}
        <div className="bg-[#FFFFFF80] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">
            Single Session Fees
          </strong>
          <div className="mt-5">
            <Label
              htmlFor="singleSession"
              className="text-[15px] text-gray-500 font-medium mb-[7.59px]"
            >
              Session Fee (Hourly) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080ba] text-[15px] font-semibold">₹</span>
              <Input
                id="singleSession"
                type="number"
                placeholder="Enter fee per hour"
                value={formData.singleSession}
                onChange={handleSingleSessionChange}
                onBlur={() => handleBlur("singleSession")}
                className="bg-white rounded-[7.26px] text-[15px] ps-6 text-black font-semibold placeholder:text-[15px] placeholder:text-[#00000066] py-3 px-4 h-[39px]"
              />
            </div>
            {touched.singleSession && !formData.singleSession && (
              <span className="text-red-500 text-sm mt-1 block">
                Session fee is required
              </span>
            )}
            {touched.singleSession &&
              formData.singleSession &&
              !isAmountValid(formData.singleSession) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid amount
                </span>
              )}
          </div>
        </div>
        {/* Package Sessions */}
        <div className="bg-[#FFFFFF80] rounded-[12px] p-4 mt-[17.9px]">
          <strong className="text-[16px] text-black font-semibold">
            Package Sessions (Optional)
          </strong>
          <div className="flex flex-col gap-2 mt-2">
            {formData.packages.map((pkg, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    id={index}
                    className="w-4 h-4 border-[1.5px] border-[#776EA5] rounded-[1.8px] ms-1"
                    checked={pkg.enabled}
                    onCheckedChange={(checked) =>
                      handlePackageChange(index, "enabled", checked)
                    }
                    disabled={!isAmountValid(formData.singleSession)}
                  />
                  <label className="text-[16px] text-gray-500 font-semibold"
                    htmlFor={index}>
                    {pkg.sessions} Sessions
                  </label>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 text-[#80808070] text-[15px] font-semibold">₹</span>
                    <Input
                      type="text"
                      placeholder={` ${1200 - index * 200}/-`}
                      value={pkg.rate}
                      onChange={(e) =>
                        handlePackageChange(index, "rate", e.target.value)
                      }
                      disabled={!pkg.enabled || !isAmountValid(formData.singleSession)}
                      className={`bg-white rounded-[5px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-[#00000066] py-3 px-2 w-[74px] h-[28px] ${!pkg.enabled || !isAmountValid(formData.singleSession)
                        ? "bg-[#ffffff90] placeholder:text-[#00000040]"
                        : ""
                        }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* KYC */}
        <div className="mt-5 bg-[#FFFFFF80] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">KYC</strong>
          <div className="mt-3">
            <Label
              htmlFor="panCard"
              className={`text-[15px] mb-[7.59px] ${isAmountValid(formData.singleSession)
                ? "text-gray-500"
                : "text-[#00000040]"
                }`}
            >
              PAN No. *
            </Label>
            <Input
              id="panCard"
              type="text"
              placeholder="Enter pan no."
              value={formData.panCard}
              onChange={handlePanChange}
              onBlur={() => handleBlur("panCard")}
              disabled={!isAmountValid(formData.singleSession)}
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${isAmountValid(formData.singleSession)
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
              !isPanValid(formData.panCard) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Invalid PAN number (e.g., ABCDE1234F)
                </span>
              )}
          </div>
          <div className="mt-5 flex items-center gap-2">
          <Checkbox
            onCheckedChange={(checked) => {
              setDontHaveGst(checked)
              if (rememberMe) {
                localStorage.setItem("doNotHaveGST", !!checked);
              }
              else {
                sessionStorage.setItem("doNotHaveGST", !!checked);
              }
            }}
            id='have_gst'
            className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1"
            checked={dontHaveGst}
          />
            <Label htmlFor="have_gst">I do not have a GST number</Label>
          </div>
          {!dontHaveGst && (
            <div className="mt-3">
              <Label
                htmlFor="gstNumber"
                className={`text-[15px] mb-[7.59px] block ${isPanValid(formData.panCard) ? "text-gray-500" : "text-[#00000040]"
                  }`}
              >
                GST No. *
              </Label>
              <div className="flex items-center bg-white rounded-[7.26px] overflow-hidden h-[39px]">
                <Select
                  value={formData.gstStateCode}
                  onValueChange={handleGstStateCodeChange}
                  onOpenChange={(open) => !open && handleBlur("gstNumber")}
                  disabled={!isPanValid(formData.panCard)}
                >
                  <SelectTrigger
                    className={`w-[60px] rounded-l-[7.26px] text-[15px] font-semibold h-[39px] px-2 ${isPanValid(formData.panCard)
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
                  disabled={!isPanValid(formData.panCard)}
                  placeholder="AAA"
                  className={`text-[15px] font-semibold px-2 text-black outline-none w-[70px] ${isPanValid(formData.panCard)
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
                !isGstValid(formData.gstNumber) && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Invalid GST number (e.g., 27ABCDE1234FZ5G)
                  </span>
                )}
            </div>
          )}
        </div>
        <IP_Buttons
          disabled={!isFormValid()}
          onSave={handleSave}
          buttonText="Save & Continue"
        />
      </div>
    </div>
  );
};

export default IP_Single_Session_Fees;