"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import PR_Header from "../PR_Header/PR_Header";
import { Textarea } from "../ui/textarea";
import Footer_bar from "../Footer_bar/Footer_bar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Select from "react-select";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2Icon, MapPin, X } from "lucide-react";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
polyfillCountryFlagEmojis();

const Patient_History = ({ type }) => {
  const router = useRouter();
  const axios = axiosInstance();

  const [fullName, setFullName] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [patientPreviousData, setPatientPreviousData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    primaryMobileNumber: "",
  });

  const [formData, setFormData] = useState({
    channelPartnerUsername: type,
    cp_patientId: patientPreviousData?._id,
    history: "",
  });

  const isFormValid = () => {
    // console.log("formData", formData);
    return (
      formData.channelPartnerUsername &&
      formData.cp_patientId &&
      formData.history
    );
  };

  const [touched, setTouched] = useState({
    history: false,
  });
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [countryList, setCountryList] = useState([]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSelectPackage = async () => {
    if (!isFormValid()) {
      showErrorToast("All Fields Are Required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`v2/cp/patient/history`, formData);

      if (response?.data?.success === true) {
        showSuccessToast(response?.data?.data?.message || "Patient added.");
        setCookie(
          "invitePatientInfo",
          JSON.stringify(response?.data?.data?.patient)
        );
        router.push(`/channel-partner/${type}/sessions-selection`);
      } else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong."
        );
      }
    } catch (err) {
      // console.log(err);
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while inviting"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = async () => {
    setCancelLoading(true);
    const confirmChange = window.confirm(`Are you sure?`);
    if (!confirmChange) {
      setCancelLoading(false);
      return;
    }

    try {
      const response = await axios.delete(`v2/cp/patient/delete`, {
        data: {
          channelPartnerUsername: type,
          cp_patientId: patientPreviousData?._id,
        },
      });

      if (response?.data?.success === true) {
        showSuccessToast(response?.data?.data?.message || "Patient deleted.");
        deleteCookie("invitePatientInfo");
        router.push(`/channel-partner/${type}/patient-registration`);
      } else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong."
        );
      }
    } catch (err) {
      // console.log(err);
      showErrorToast(
        err?.response?.data?.error?.message || "An error occurred while cancel"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const countryOptions = useMemo(
    () =>
      countryList.map((country) => ({
        value: `${country.flag} ${country.code}`,
        label: `${country.flag} ${country.code}`,
        name: country.name,
      })),
    [countryList]
  );
  useEffect(() => {
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
    getCountryList();
  }, []);

  useEffect(() => {
    const cookieData = getCookie("channelPartnerData");
    const patientData = getCookie("invitePatientInfo");
    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData);
        // console.log("parsedData", parsedData);
        setChannelPartnerData(parsedData);
      } catch (error) {
        setChannelPartnerData(null);
      }
    } else {
      setChannelPartnerData(null);
      router.push(`/channel-partner/${type}`);
    }

    if (patientData) {
      try {
        const parsedData = JSON.parse(patientData);
        setFullName(`${parsedData?.firstName} ${parsedData?.lastName}`);
        // console.log('parsedData_history_patient',parsedData)
        setPatientPreviousData(parsedData);
        setFormData((prev) => ({
          ...prev,
          cp_patientId: parsedData?._id || "",
          history: parsedData?.history?.details,
        }));
        // console.log("patient", parsedData);
      } catch (error) {
        setPatientPreviousData(null);
      }
    } else {
      setPatientPreviousData(null);
      router.push(`/channel-partner/${type}`);
    }
  }, [type]);

  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
        <PR_Header />
        <div className="h-full pb-[30%] lg:pb-0 overflow-auto px-[16px] bg-gradient-to-t  from-[#fce8e5]  to-[#eeecfb]">
          <div className="w-full h-[25px] text-[#776EA5] font-semibold text-[20px] leading-[25px] mb-2 text-center">
            {channelPartnerData?.clinicName || "Greetings Hospital"}
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
              <MapPin color="white" className="w-[12.15px] h-[12.15px]" />
            </div>
            <span className="text-sm text-[#776EA5] font-medium">
              {channelPartnerData?.area}
            </span>
          </div>
          {/* Patient Number and Mobile */}
          <div className="bg-[#ffffff66] rounded-[12px] p-5 relative">
            {/* Patient Name Input */}
            <div>
              <Label className="text-[15px] text-gray-500 mb-[7.59px]">
                Patient Name<span className="text-red-500">*</span>
              </Label>
              <Input
                disabled
                value={fullName}
                type="text"
                placeholder="Enter First Name"
                className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-3 px-4 h-[39px]  opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
                Primary Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center relative">
                {/* Custom Country Dropdown */}
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) =>
                      option.value ===
                      (patientPreviousData?.countryCode_primary || "🇮🇳 +91")
                  )}
                  isDisabled={true}
                  className="w-[100px] border-none shadow-none"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "7.26px 0 0 7.26px",
                      borderRightWidth: 0,
                      height: "39px",
                      minHeight: "39px",
                      width: "max-content",
                      backgroundColor: formData.lastName ? "#fff" : "#fcf9fb",
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
                  type="text"
                  value={patientPreviousData?.primaryMobileNumber}
                  disabled={true}
                  placeholder="Enter Mobile Number"
                  className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-medium font-semibold py-2 px-4 h-[38px] w-full"
                />
              </div>
            </div>
          </div>

          {/* Patient History box with 16px gap */}
          <div className="bg-[#FFFFFFB2] rounded-[12px] p-4 mt-4 mb-5">
            <div>
              <Label className="text-[15px] text-[#000000] font-[600] leading-[16px] tracking-[0]  w-[114px] h-[16px] mb-4 font-['Quicksand'] py-2.5">
                Patient History
              </Label>
              <div className="flex items-center justify-center ">
                <Textarea
                  onChange={(e) =>
                    setFormData({ ...formData, history: e.target.value })
                  }
                  value={formData.history}
                  onBlur={() => handleBlur("history")}
                  placeholder="Add Patient History...."
                  className=" bg-white text-[15px] text-[#000000] placeholder:text-gray-500 placeholder:font-medium shadow-none ronuded-[7.26px]"
                />
              </div>
              {touched.history && !formData.history && (
                <span className="text-red-500 text-sm mt-1 block">
                  History field is required
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex flex-col justify-between items-center gap-4 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
            <div className="w-full flex gap-[12.2px]">
              {/* <Button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
              >
                {cancelLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Cancel"
                )}
              </Button> */}

              <Drawer className="pt-[9.97px] max-w-[576px] m-auto">
                <DrawerTrigger className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                  Cancel
                </DrawerTrigger>
                <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
                  <DrawerHeader>
                    <DrawerTitle className="text-[16px] font-[600] text-center">
                      Are you sure
                    </DrawerTitle>
                    <DrawerDescription className="mt-6 flex gap-3 w-full">
                      <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                        Confirm
                      </Button>

                      <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
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
                onClick={handleSelectPackage}
                disabled={loading}
                className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] mx-auto rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Select Package"
                )}

                {/* </Link> */}
              </Button>
            </div>
            <Footer_bar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Patient_History;
