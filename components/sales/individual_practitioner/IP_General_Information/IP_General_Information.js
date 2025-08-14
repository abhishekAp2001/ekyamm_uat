"use client";
import React, { useEffect, useState } from "react";
import IP_Header from "../IP_Header/IP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ChevronDown, CirclePlus } from "lucide-react";
import IP_Buttons from "../IP_Buttons/IP_Buttons";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";
import { getCookie, hasCookie } from "cookies-next";
import { useRememberMe } from "@/app/context/RememberMeContext";
import { Checkbox } from "@/components/ui/checkbox";
import { getStorage } from "@/lib/utils";

const IP_General_Information = () => {
  const { rememberMe } = useRememberMe()
  const axios = axiosInstance();
  const router = useRouter();
  const [languageList, setLanguageList] = useState([]);
  const [specialisationInput, setSpecialisationInput] = useState("");
  const [specialisationList, setSpecialisationList] = useState([]);
  const [dontTreatInput, setDontTreatInput] = useState("");
  const [dontTreatList, setDontTreatList] = useState([]);
  const [languageInput, setLanguageInput] = useState("");
  const [languageListFinal, setLanguageListFinal] = useState([]);
  // const [dontHaveMedicalAssociation, setDontHaveMedicalAssociation] = useState(false);
  // useEffect(() => {
  //   const doNotHaveMedicalAssociation = rememberMe ? (localStorage.getItem("doNotHaveMedicalAssociation") === "true") : (sessionStorage.getItem("doNotHaveMedicalAssociation") === "true");
  //   if (doNotHaveMedicalAssociation) {
  //     setDontHaveMedicalAssociation(doNotHaveMedicalAssociation);
  //   }
  // }, [rememberMe]);
  const [touched, setTouched] = useState({
    yearsOfExperience: false,
    specialization: false,
    whatIDontTreat: false,
    whatToExpectInSession: false,
    languageProficiency: false,
  });

  const [formData, setFormData] = useState({
    yearsOfExperience: "0",
    specialization: "",
    whatIDontTreat: "",
    whatToExpectInSession: "",
    languageProficiency: "",
    address: "",
    googleMapAddress: "",
  });

  // Load form data from cookie on component mount
  useEffect(() => {
    const savedData = rememberMe ? localStorage.getItem("ip_general_information") : sessionStorage.getItem("ip_general_information");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setSpecialisationList(
          parsedData.specialization ? parsedData.specialization.split(", ") : []
        );
        setDontTreatList(
          parsedData.whatIDontTreat ? parsedData.whatIDontTreat.split(", ") : []
        );
        setLanguageListFinal(
          parsedData.languageProficiency
            ? parsedData.languageProficiency.split(", ")
            : []
        );
        if (parsedData.yearsOfExperience)
          setTouched((prev) => ({ ...prev, yearsOfExperience: true }));
        if (parsedData.specialization)
          setTouched((prev) => ({ ...prev, specialization: true }));
        if (parsedData.whatIDontTreat)
          setTouched((prev) => ({ ...prev, whatIDontTreat: true }));
        if (parsedData.whatToExpectInSession)
          setTouched((prev) => ({ ...prev, whatToExpectInSession: true }));
        if (parsedData.languageProficiency)
          setTouched((prev) => ({ ...prev, languageProficiency: true }));
      } catch (error) {
        console.error("Error parsing ip_general_information cookie:", error);
      }
    }
  }, []);

  const getLanguageList = async () => {
    try {
      const response = await axios.get("v2/cp/ip/languages");
      if (response?.data?.success) {
        setLanguageList(response?.data?.data);
      }
    } catch (error) {
      // console.log(error);
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
    getLanguageList();
  }, []);

  const handleAddToList = (input, setInput, list, setList, field) => {
    const trimmed = input.trim();
    if (!trimmed || list.includes(trimmed)) return;
    const newList = [...list, trimmed];
    setList(newList);
    setInput("");
    setFormData((prev) => ({
      ...prev,
      [field]: newList.join(", "),
    }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRemoveFromList = (indexToRemove, list, setList, field) => {
    const newList = list.filter((_, index) => index !== indexToRemove);
    setList(newList);
    setFormData((prev) => ({
      ...prev,
      [field]: newList.join(", "),
    }));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation functions
  const isYearsOfExperienceValid = () =>
    /^\d+$/.test(formData.yearsOfExperience) &&
    formData.yearsOfExperience !== "";
  const isSpecializationValid = () => formData.specialization !== "";
  const isWhatIDontTreatValid = () => formData.whatIDontTreat !== ""; // Valid if at least one item
  const isWhatToExpectValid = () => formData.whatToExpectInSession !== "";
  const isLanguageProficiencyValid = () => formData.languageProficiency !== "";

  const isFormValid = () => {
    return (
      isYearsOfExperienceValid() &&
      isSpecializationValid() &&
      isWhatToExpectValid() &&
      isLanguageProficiencyValid()
    );
  };

  const handleSave = () => {
    if (isFormValid()) {
      if (rememberMe) {
        // localStorage.setItem("doNotHaveMedicalAssociation", !!dontHaveMedicalAssociation)
        localStorage.setItem("ip_general_information", JSON.stringify(formData));
      }
      else {
        // sessionStorage.setItem("doNotHaveMedicalAssociation", !!dontHaveMedicalAssociation)
        sessionStorage.setItem("ip_general_information", JSON.stringify(formData));
      }
      router.push("/sales/ip_medical_association_details");
    } else {
      showErrorToast("Please fill all required fields correctly");
    }
  };

  useEffect(() => {
    // const token = hasCookie("user") ? JSON.parse(getCookie("user")) : null
    const token = getStorage("user", rememberMe);
    const raw = rememberMe ? localStorage.getItem("ip_details") : sessionStorage.getItem("ip_details")
    const ip_type_token = raw ? JSON.parse(raw) : null
    if (!token) {
      router.push('/login')
    }
    else if (!ip_type_token) {
      router.push('/sales/ip_details')
    }
  }, [])
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <IP_Header text="Add Individual Practitioner Details" />
      <div className="h-full pb-[26%] pt-[15%] md:pt-[10%] lg:pb-[16%] overflow-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
        {/* General Information */}
        <div className="bg-[#FFFFFF80] rounded-[12px] p-4">
          <strong className="text-[15px] text-black font-semibold">
            General Information
          </strong>

          {/* Experience */}
          <div className="flex justify-between items-baseline">
            <Label className="text-[15px] mb-2 mt-[22px] text-gray-500">
              Years of Experience *
            </Label>
            <div>
              <div className="flex items-baseline justify-end gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-gray-500 py-3 px-[7px] w-[46px] h-[38px]"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange(e, "yearsOfExperience")}
                  onBlur={() => handleBlur("yearsOfExperience")}
                />
                <span className="text-[15px] text-gray-500">Years</span>
              </div>
              {touched.yearsOfExperience && !formData.yearsOfExperience && (
                <span className="text-red-500 text-sm mt-1 block">
                  Years of experience is required
                </span>
              )}
              {touched.yearsOfExperience &&
                formData.yearsOfExperience &&
                !isYearsOfExperienceValid() && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Must be a valid number
                  </span>
                )}
            </div>
          </div>

          {/* Specialization selector */}
          <div className="w-full max-w-md mt-4">
            <div>
              <Label
                className={`text-[15px] font-medium mb-[7.59px] ${isYearsOfExperienceValid()
                  ? "text-gray-500"
                  : "text-[#00000040]"
                  }`}
              >
                Specialisation <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your specialisation"
                  className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-3 h-[38px] ${isYearsOfExperienceValid()
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                    }`}
                  value={specialisationInput}
                  onChange={(e) => setSpecialisationInput(e.target.value)}
                  disabled={!isYearsOfExperienceValid()}
                />
                <CirclePlus
                  size={20}
                  className={`w-5 h-5 absolute top-2 right-2 cursor-pointer ${isYearsOfExperienceValid()
                    ? "text-gray-500"
                    : "text-[#00000040]"
                    }`}
                  onClick={() =>
                    isYearsOfExperienceValid() &&
                    handleAddToList(
                      specialisationInput,
                      setSpecialisationInput,
                      specialisationList,
                      setSpecialisationList,
                      "specialization"
                    )
                  }
                />
              </div>
              <ul className="flex flex-wrap gap-[10px] mt-2">
                {specialisationList.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-[5px] py-0 px-1 bg-white rounded-[5px] text-[15px] text-gray-500 hover:bg-gray-200"
                  >
                    {item}
                    <X
                      className="w-[11px] h-[11px] text-[#776EA5] border border-[#776EA5] rounded-full"
                      onClick={() =>
                        handleRemoveFromList(
                          index,
                          specialisationList,
                          setSpecialisationList,
                          "specialization"
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
              {touched.specialization && !formData.specialization && (
                <span className="text-red-500 text-sm mt-1 block">
                  At least one specialisation is required
                </span>
              )}
            </div>

            <div className="mt-[22px]">
              <Label
                className={`text-[15px] font-medium mb-[7.59px] ${isSpecializationValid() ? "text-gray-500" : "text-[#00000040]"
                  }`}
              >
                What I don’t Treat
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Share your concerns..."
                  className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-3 h-[38px] ${isSpecializationValid()
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                    }`}
                  value={dontTreatInput}
                  onChange={(e) => setDontTreatInput(e.target.value)}
                  disabled={!isSpecializationValid()}
                />
                <CirclePlus
                  size={20}
                  className={`w-5 h-5 absolute top-2 right-2 cursor-pointer ${isSpecializationValid()
                    ? "text-gray-500"
                    : "text-[#00000040]"
                    }`}
                  onClick={() =>
                    isSpecializationValid() &&
                    handleAddToList(
                      dontTreatInput,
                      setDontTreatInput,
                      dontTreatList,
                      setDontTreatList,
                      "whatIDontTreat"
                    )
                  }
                />
              </div>
              <ul className="flex flex-wrap gap-[10px] mt-2">
                {dontTreatList.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-[5px] py-0 px-1 bg-white rounded-[5px] text-[15px] text-gray-500 hover:bg-gray-200"
                  >
                    {item}
                    <X
                      className="w-[11px] h-[11px] text-[#776EA5] border border-[#776EA5] rounded-full"
                      onClick={() =>
                        handleRemoveFromList(
                          index,
                          dontTreatList,
                          setDontTreatList,
                          "whatIDontTreat"
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* textarea */}
          <div className="mt-4">
            <Label
              className={`text-[15px] font-medium mb-[7.59px] ${isWhatIDontTreatValid() ? "text-gray-500" : "text-[#00000040]"
                }`}
            >
              What to Expect in the Session{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Share your expectations or any specific concerns you have."
              className={`text-[15px] text-black font-semibold ${isWhatIDontTreatValid()
                ? "bg-white"
                : "bg-[#ffffff90] text-[#00000040] placeholder:font-medium placeholder:text-gray-500"
                }`}
              value={formData.whatToExpectInSession}
              onChange={(e) => handleInputChange(e, "whatToExpectInSession")}
              onBlur={() => handleBlur("whatToExpectInSession")}
              disabled={!isWhatIDontTreatValid()}
            />
            {touched.whatToExpectInSession &&
              !formData.whatToExpectInSession && (
                <span className="text-red-500 text-sm mt-1 block">
                  Session expectations are required
                </span>
              )}
          </div>

          {/* select language */}
          <div className="w-full max-w-md mt-4">
            <div className="mt-[22px]">
              <Label
                className={`text-[15px] font-medium mb-[7.59px] ${isWhatToExpectValid() ? "text-gray-500" : "text-[#00000040]"
                  }`}
              >
                Language Proficiency <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Language"
                  className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-3 h-[38px] ${isWhatToExpectValid()
                    ? "bg-white placeholder:text-gray-500"
                    : "bg-[#ffffff90] placeholder:text-[#00000040]"
                    }`}
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  disabled={!isWhatToExpectValid()}
                />
                <CirclePlus
                  size={20}
                  className={`cursor-pointer w-5 h-5 absolute top-2 right-2 ${isWhatToExpectValid() ? "text-gray-500" : "text-[#00000040]"
                    }`}
                  onClick={() =>
                    isWhatToExpectValid() &&
                    handleAddToList(
                      languageInput,
                      setLanguageInput,
                      languageListFinal,
                      setLanguageListFinal,
                      "languageProficiency"
                    )
                  }
                />
              </div>
              <ul className="flex flex-wrap gap-[10px] mt-2">
                {languageListFinal.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-[5px] py-[2px] px-2 bg-white rounded-[5px] text-[15px] text-gray-500 hover:bg-gray-200"
                  >
                    {item}
                    <X
                      className="w-[11px] h-[11px] text-[#776EA5] border border-[#776EA5] rounded-full"
                      onClick={() =>
                        handleRemoveFromList(
                          index,
                          languageListFinal,
                          setLanguageListFinal,
                          "languageProficiency"
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
              {touched.languageProficiency && !formData.languageProficiency && (
                <span className="text-red-500 text-sm mt-1 block">
                  At least one language is required
                </span>
              )}
            </div>
            <div className="">
              <Label
                htmlFor="text"
                className={`text-[15px] font-medium mb-[7.59px] ${isWhatToExpectValid() ? "text-gray-500" : "text-[#00000040]"
                  }`}
              >
                Suggested Languages
              </Label>
              <div className="flex gap-2 flex-wrap items-center">
                {languageList?.map((language, index) => (
                  <Button
                    key={index}
                    className="bg-[#776EA5] rounded-[5px] h-6 flex items-center text-[15px] font-medium px-0"
                    onClick={() =>
                      handleAddToList(
                        language,
                        setLanguageInput,
                        languageListFinal,
                        setLanguageListFinal,
                        "languageProficiency"
                      )
                    }
                    disabled={!isWhatToExpectValid()}
                  >
                    {language}
                    <CirclePlus
                      size={11}
                      className="cursor-pointer w-[11px] h-[11px] text-white suggested_languages ml-[-4px]"
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* in-person session */}
        <div className="bg-[#FFFFFF80] rounded-[12px] p-4 mt-[17.9px]">
          <strong className="text-[15px] text-black font-semibold">
            In-Person Sessions (Optional)
          </strong>
          <div className="mt-3">
            <Label
              htmlFor="text"
              className="text-[15px] font-medium mb-[7.59px] text-gray-500"
            >
              Address
            </Label>
            <Input
              type="text"
              placeholder="Type Full Address"
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-[#00000066] py-3 px-4 h-[39px]"
              value={formData.address}
              onChange={(e) => handleInputChange(e, "address")}
            />
          </div>
          <div className="mt-5">
            <Label
              htmlFor="text"
              className="text-[15px] font-medium mb-[7.59px] text-gray-500"
            >
              Add Google Maps
            </Label>
            <Input
              type="text"
              placeholder="Add Google Maps Link"
              className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-[#00000066] py-3 px-4 h-[39px]"
              value={formData.googleMapAddress}
              onChange={(e) => handleInputChange(e, "googleMapAddress")}
            />
          </div>
          {/* <div className="mt-5 flex items-center gap-2">
            <Checkbox
              onCheckedChange={(checked) => {
                setDontHaveMedicalAssociation(checked)
                if (rememberMe) {
                  localStorage.setItem("doNotHaveMedicalAssociation", !!checked)
                }
                else {
                  sessionStorage.setItem("doNotHaveMedicalAssociation", !!checked)
                }
              }}
              id='have_medical_association'
              className="w-4 h-4 border border-[#776EA5] rounded-[1.8px] ms-1"
              checked={dontHaveMedicalAssociation}
            />
            <Label htmlFor="have_medical_association">I do not have a medical association</Label>

          </div> */}
        </div>

        {/* Button footer */}
        <IP_Buttons
          disabled={!isFormValid()}
          onSave={handleSave}
          buttonText="Save & Continue"
        />
      </div>
    </div>
  );
};

export default IP_General_Information;
