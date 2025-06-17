"use client";

import React, { useEffect, useState } from "react";
import CP_Header from "@/components/CP_Header/CP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CP_buttons from "@/components/CP_buttons/CP_buttons";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axios from "axios";
import { showErrorToast } from "@/lib/toast";

const CP_clinic_details = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  const [touched, setTouched] = useState({
    pincode: false,
    area: false,
    city: false,
    state: false,
  });

  // Validation functions
  const isPincodeValid = (pincode) => /^\d{6}$/.test(pincode);
  const isFormValid = () =>
    isPincodeValid(formData.pincode) &&
    formData.area &&
    formData.city &&
    formData.state;

  // Load form data from cookie on component mount
  useEffect(() => {
    const savedData = getCookie("cp_clinic_details");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Mark fields as touched if they have values
        setTouched({
          pincode: !!parsedData.pincode,
          area: !!parsedData.area,
          city: !!parsedData.city,
          state: !!parsedData.state,
        });
      } catch (error) {
        console.error("Error parsing cp_clinic_details cookie:", error);
      }
    }
  }, []);

  // Handle PIN code change and API call
  const handlePincodeChange = async (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: digitsOnly }));

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
            area: Name,
            city: Block === "NA" ? District : Block,
            state: State,
          }));
          setTouched((prev) => ({
            ...prev,
            area: true,
            city: true,
            state: true,
          }));
        } else if (response?.data[0]?.Status === "Error") {
          setFormData((prev) => ({
            ...prev,
            area: "",
            city: "",
            state: "",
          }));
          showErrorToast("Invalid PIN code");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        showErrorToast("Failed to fetch location data");
        setFormData((prev) => ({
          ...prev,
          area: "",
          city: "",
          state: "",
        }));
      }
    } else {
      // Clear dependent fields if PIN code is invalid
      setFormData((prev) => ({
        ...prev,
        area: "",
        city: "",
        state: "",
      }));
    }
  };

  // Handle input change for text fields
  const handleInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Handle blur for input fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle save and continue
  const handleSave = () => {
    if (isFormValid()) {
      setCookie("cp_clinic_details", formData);
      router.push("/sales/cp_doctor_details");
    } else {
      setTouched({
        pincode: true,
        area: true,
        city: true,
        state: true,
      });
    }
  };

  return (
    <div className="bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5] h-full flex flex-col">
      <CP_Header />
      <div className="min-h-screen pt-[10%] pb-[4%] overflow-auto px-[17px] mt-3 bg-gradient-to-t from-[#e5e3f5] via-[#f1effd] via-50% to-[#e5e3f5]">
        <div className="bg-[#FFFFFF80] rounded-[12px] p-4 px-3">
          <strong className="text-[16px] text-black font-semibold">
            Clinic Address Details
          </strong>
          <div>
            <Label
              htmlFor="pincode"
              className="text-[15px] text-gray-500 mb-2 mt-5"
            >
              Pincode *
            </Label>
            <Input
              id="pincode"
              type="number"
              inputMode="numeric"
              placeholder="400053"
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-gray-500 pt-3 pb-3.5 px-4 h-[39px]"
              value={formData.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              onBlur={() => handleBlur("pincode")}
            />
            {touched.pincode && !formData.pincode && (
              <span className="text-red-500 text-sm mt-1 block">
                Pincode is required
              </span>
            )}
            {touched.pincode &&
              formData.pincode &&
              !isPincodeValid(formData.pincode) && (
                <span className="text-red-500 text-sm mt-1 block">
                  Pincode must be 6 digits
                </span>
              )}
          </div>
          <div>
            <Label
              htmlFor="area"
              className={`text-[15px] mb-2 mt-[22px] ${
                isPincodeValid(formData.pincode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              Area Name *
            </Label>
            <Input
              id="area"
              type="text"
              placeholder="Pimple Saudagar"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] pt-3 pb-3.5 px-4 h-[39px] ${
                isPincodeValid(formData.pincode)
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff10] placeholder:text-[#00000040]"
              }`}
              value={formData.area}
              onChange={(e) => handleInputChange(e, "area")}
              onBlur={() => handleBlur("area")}
              disabled={!isPincodeValid(formData.pincode)}
            />
            {touched.area && !formData.area && (
              <span className="text-red-500 text-sm mt-1 block">
                Area is required
              </span>
            )}
          </div>
          <div>
            <Label
              htmlFor="city"
              className={`text-[15px] mb-2 mt-[22px] ${
                isPincodeValid(formData.pincode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              City *
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Mumbai"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] pt-3 pb-3.5 px-4 h-[39px] ${
                isPincodeValid(formData.pincode)
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff10] placeholder:text-[#00000040]"
              }`}
              value={formData.city}
              onChange={(e) => handleInputChange(e, "city")}
              onBlur={() => handleBlur("city")}
              disabled={!isPincodeValid(formData.pincode)}
            />
            {touched.city && !formData.city && (
              <span className="text-red-500 text-sm mt-1 block">
                City is required
              </span>
            )}
          </div>
          <div>
            <Label
              htmlFor="state"
              className={`text-[15px] mb-2 mt-[22px] ${
                isPincodeValid(formData.pincode)
                  ? "text-gray-500"
                  : "text-[#00000040]"
              }`}
            >
              State *
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="Maharashtra"
              className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] pt-3 pb-3.5 px-4 h-[39px] ${
                isPincodeValid(formData.pincode)
                  ? "bg-white placeholder:text-gray-500"
                  : "bg-[#ffffff10] placeholder:text-[#00000040]"
              }`}
              value={formData.state}
              onChange={(e) => handleInputChange(e, "state")}
              onBlur={() => handleBlur("state")}
              disabled={!isPincodeValid(formData.pincode)}
            />
            {touched.state && !formData.state && (
              <span className="text-red-500 text-sm mt-1 block">
                State is required
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

export default CP_clinic_details;
