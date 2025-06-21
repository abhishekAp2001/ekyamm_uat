"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "../ui/button";
import Select_Header from "../Select_Header/Select_header";
import Footer_bar from "../Footer_bar/Footer_bar";
import Link from "next/link";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Select from "react-select";
import axiosInstance from "@/lib/axiosInstance";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { Loader2Icon, MapPin } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  calculatePaymentDetails,
  clinicSharePercent,
  formatAmount,
} from "@/lib/utils";
polyfillCountryFlagEmojis();

const Cloudnine_Hospital = ({ type }) => {
  const router = useRouter();
  const axios = axiosInstance();

  const [fullName, setFullName] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);
  const [billingType, setBillingType] = useState("");
  const [totalPayable, setTotalPayable] = useState(0);
  const [patientPreviousData, setPatientPreviousData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    primaryMobileNumber: "",
  });

  const [formData, setFormData] = useState({
    channelPartnerUsername: type,
    cp_patientId: patientPreviousData?._id,
    sessionCreditCount: "",
    sessionPrice: 0,
  });

  const [feesData, setFeesData] = useState({
    fees: [],
    min: 0,
    max: 0,
  });

  const isFormValid = () => {
    // console.log("formData", formData);
    return (
      formData.channelPartnerUsername &&
      formData.cp_patientId &&
      formData.sessionCreditCount &&
      formData.sessionPrice
    );
  };

  const handleGenerateInvoice = async () => {
    try {
      const payload = {
        channelPartnerUsername: formData?.channelPartnerUsername,
        cp_patientId: formData?.cp_patientId,
        sessionCreditCount: formData?.sessionCreditCount,
        sessionPrice: String(formData?.sessionPrice),
      };

      if (billingType === "onSpot") {
        setCookie("sessions_selection", JSON.stringify(formData));
        router.push(`/channel-partner/${type}/pay-for-sessions`);
      } else {
        const response = await axios.post(
          `v2/cp/patient/sessionCredits`,
          payload
        );
        if (response?.data?.success) {
          setCookie("sessions_selection", JSON.stringify(formData));
          showSuccessToast("Patient Invited & Invoice Sent");
          router.push(`/channel-partner/${type}/invoice_sent`);
        }
      }
    } catch (error) {
      showErrorToast(response?.data?.error?.message || "Something went wrong.");
    }
  };

  const [touched, setTouched] = useState({
    sessionCreditCount: false,
    sessionPrice: false,
  });
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [countryList, setCountryList] = useState([]);

  const sessions = [
    { count: "4", name: "4 Sessions" },
    { count: "8", name: "8 Sessions" },
    { count: "12", name: "12 Sessions" },
  ];

  const handleFeeChange = (value) => {
    setLoading(true);
    const closestFee = feesData?.fees?.reduce((prev, curr) =>
      Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
    );
    // console.log(closestFee);
    setFormData((prev) => ({
      ...prev,
      sessionPrice: closestFee,
    }));

    setLoading(false);
  };

  const handleSessionChange = async (count) => {
    setFeeLoading(true);
    setLoading(true);
    setFormData((prev) => ({
      ...prev,
      sessionCreditCount: prev.sessionCreditCount === count ? null : count,
    }));

    try {
      const response = await axios.post(`v2/practitioner/fees/range`, {
        username: type,
        sessions: count,
      });

      if (response?.data?.success === true) {
        if (Array.isArray(response?.data?.data.fees)) {
          setFeesData({
            fees: response?.data?.data.fees,
            min: response?.data?.data.min,
            max: response?.data?.data.max,
          });

          setFormData((prev) => ({
            ...prev,
            sessionPrice:
              response?.data?.data.fees[0] || response?.data?.data.min,
          }));
        }
        // showSuccessToast(response?.data?.data?.message || "Patient added.");
      } else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong."
        );
      }
    } catch (err) {
      // console.log(err);
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while fees fetching"
      );
    } finally {
      setFeeLoading(false);
    }
    try {
      const response = await axios.post(`v2/practitioner/fees/range`, {
        username: type,
        sessions: count,
      });

      if (response?.data?.success === true) {
        if (Array.isArray(response?.data?.data.fees)) {
          setFeesData({
            fees: response?.data?.data.fees,
            min: response?.data?.data.min,
            max: response?.data?.data.max,
          });

          setFormData((prev) => ({
            ...prev,
            sessionPrice:
              response?.data?.data.fees[0] || response?.data?.data.min,
          }));
        }
        // showSuccessToast(response?.data?.data?.message || "Patient added.");
      } else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong."
        );
      }
    } catch (err) {
      // console.log(err);
      showErrorToast(
        err?.response?.data?.error?.message ||
          "An error occurred while fees fetching"
      );
    } finally {
      setFeeLoading(false);
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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
        setChannelPartnerData(parsedData);
        setBillingType(parsedData?.billingType);
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
        setPatientPreviousData(parsedData);
        setFormData((prev) => ({
          ...prev,
          cp_patientId: parsedData?._id || "",
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

  useEffect(() => {
    const calculatePrice = () => {
      const result = calculatePaymentDetails(
        formData.sessionPrice,
        formData.sessionCreditCount,
        clinicSharePercent
      );
      setTotalPayable(result?.totalPayable || 0);
    };
    calculatePrice();
  }, [formData.sessionPrice, formData.sessionCreditCount]);

  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col">
        <Select_Header />
        <div className="h-full overflow-auto pb-[28%] px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
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
          {/* Patient Details */}
          <div className="bg-[#ffffff66] rounded-[12px] p-5 mt-[25px] relative">
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
                className="bg-white rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 font-semibold py-3 px-4 h-[39px]  opacity-50 cursor-not-allowed"
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
                  className="w-[100px] border-none focus:border-none hover:border-none hover:outline-none"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "7.26px 0 0 7.26px",
                      borderRightWidth: 0,
                      height: "39px",
                      minHeight: "39px",
                      width: "max-content",
                       backgroundColor:formData.lastName ?"#fff" : "#fcf9fb"
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
                  className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-[15px] placeholder:text-gray-500 font-semibold py-2 px-4 h-[38px] w-full"
                />
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="mt-3 bg-[#FFFFFF80] rounded-[12px] px-4 pt-4 pb-2">
            <strong className="text-[15px] font-[600] text-black block mb-4">
              Select Number of Sessions
            </strong>
            {sessions.map((_session, _x) => {
              return (
                <div className="flex items-center gap-2 mb-4" key={_x}>
                  <Checkbox
                    id={`session${_session.count}`}
                    className="h-4 w-[16.05px] border-[1.5px] border-[#776EA5] rounded-[1.5px]"
                    onCheckedChange={() => handleSessionChange(_session.count)}
                    checked={formData.sessionCreditCount === _session.count}
                    disabled={feeLoading}
                    handleBlur={"sessionCreditCount"}
                  />
                  <Label
                    htmlFor={`session${_session.count}`}
                    className="text-[15px] text-gray-500 font-semibold"
                  >
                    {`${_session.name}`}
                  </Label>
                </div>
              );
            })}

            {touched.sessionCreditCount && !formData.sessionCreditCount && (
              <span className="text-red-500 text-sm mt-1 block">
                Please Select Session
              </span>
            )}
          </div>

          {/* Session Fees */}
          <div className="my-3 bg-[#FFFFFF80] rounded-[12px] pl-4 pb-4 pt-4">
            <strong className="text-[15px] font-[600] text-black block mb-3">
              Select Session Fees
            </strong>
            <div className="bg-white rounded-[12px] p-5">
              <div className="text-[15px] text-gray-500 font-[500] mb-3">
                Session Fee (Hourly):{" "}
                <span className="font-[700]">
                  ₹{formData.sessionPrice || "None"} per session
                </span>
              </div>

              <Slider
                value={[formData.sessionPrice]}
                onValueChange={handleFeeChange}
                min={feesData.min}
                max={feesData.max}
                step={1}
                disabled={feeLoading}
                className="w-full mt-4"
                handleBlur={"sessionPrice"}
              />
              <div className="flex justify-between mt-2 text-[15px] text-[#776EA5] font-[600]">
                <span>&#8377;{feesData.min}/-</span>
                <span>&#8377;{feesData.max}/-</span>
              </div>
            </div>
            {touched.sessionCreditCount && !formData.sessionCreditCount && (
              <span className="text-red-500 text-sm mt-1 block">
                Please Select Session
              </span>
            )}
          </div>
        </div>
        {/* Buttons */}
        <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] flex flex-col items-center gap-3 fixed bottom-0 pb-[23px] px-[17px] left-0 right-0 max-w-[576px] mx-auto">
          <div className="w-full flex gap-[12.2px]">
            <Button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
            >
              {cancelLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Cancel"
              )}
            </Button>
            <Button
              onClick={handleGenerateInvoice}
              disabled={loading || !isFormValid()}
              className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white rounded-[8px] w-[48%] h-[45px]"
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : billingType === "onSpot" ? (
                <div className="leading-tight">
                  <div>Pay {totalPayable}/-</div>
                  <div className="text-[12px] font-normal">
                    ({formData?.sessionCreditCount} Sessions)
                  </div>
                </div>
              ) : (
                "Generate Invoice"
              )}
            </Button>
          </div>
          <Footer_bar />
        </div>
      </div>
    </>
  );
};

export default Cloudnine_Hospital;
