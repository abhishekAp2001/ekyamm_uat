"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  CirclePlus,
  CircleX,
  ChevronLeft,
  X,
  Loader2,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { showErrorToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { Input } from "@/components/ui/input";

const Filter = ({
  setShowFilter,
  onApplyFilter,
  initialParams,
  loading = false,
}) => {
  const axios = axiosInstance();
  const [selectedGender, setSelectedGender] = useState(
    initialParams.gender || ""
  );
  const [languageInput, setLanguageInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialParams.language || ""
  );
  const [languageList, setLanguageList] = useState([]); // State for API-fetched languages
  const [sessionFee, setSessionFee] = useState(initialParams.sessionFee || "");

  useEffect(() => {
    setSelectedGender(initialParams.gender || "");
    setSelectedLanguage(initialParams.language || "");
    setSessionFee(initialParams.sessionFee || "");
  }, [initialParams]);

  useEffect(() => {
    const getLanguageList = async () => {
      try {
        const response = await axios.get("v2/cp/ip/languages");
        if (response?.data?.success) {
          setLanguageList(response?.data?.data);
        }
      } catch (error) {
        console.log(error);
        if (error.forceLogout) {
          router.push("/login");
        } else {
          showErrorToast(
            error?.response?.data?.error?.message || "Something Went Wrong"
          );
        }
      }
    };
    getLanguageList();
  }, []);

  useEffect(() => {
    setSelectedGender(initialParams.gender || "");
    setSelectedLanguage(initialParams.language || "");
    setSessionFee(initialParams.sessionFee || "");
  }, [initialParams]);

  const handleAddToList = (value, setInput) => {
    if (value) {
      setSelectedLanguage(value);
      setInput("");
    }
  };

  const handleRemoveFromList = () => {
    setSelectedLanguage("");
  };

  const handleApply = () => {
    console.log("in");
    const params = {
      language: selectedLanguage || "", // Default to Hindi if none selected
      sessionFee: sessionFee || "",
      gender: selectedGender || "",
    };
    onApplyFilter(params);
  };

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] min-h-screen flex flex-col max-w-[576px] mx-auto">
      <>
        <div className=" bg-[#FFFFFF] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-10">
          <div className="flex items-center p-4 pl-3 gap-[9px]">
            <ChevronLeft
              size={28}
              className=" text-black-700"
              onClick={() => {
                setShowFilter(false);
              }}
            />
            <div className="flex-1 text-[16px] font-[600] text-gray-800">
              Filter
            </div>
            <div className="h-6 w-6" /> {/* Space */}
          </div>
        </div>
      </>
      <div className="flex-grow px-4 mt-[18px] pb-[90px] pt-[16%] lg:pt-[10%]">
        {/* Session Fee */}
        <div className="bg-white rounded-[12px] p-4 mb-[10px]">
          <div className="text-[15px] font-[500] text-gray-500 mb-3">
            Session Fee
          </div>
          <Slider
            value={[sessionFee]}
            onValueChange={(value) => setSessionFee(value[0])}
            max={1500}
            min={150}
            step={10}
          />
          <div className="flex justify-between mt-2 text-[12px] text-[#6D6A5D] font-[500]">
            <span>₹150/-</span>
            <span>₹1,500/-</span>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-4 mb-[10px]">
          <div className="text-[15px] font-[500] text-gray-500 mb-2">
            Gender
          </div>
          <RadioGroup
            value={selectedGender}
            onValueChange={setSelectedGender}
            className="flex gap-4 items-center"
          >
            {["male", "female", "other"].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem value={gender} id={gender} />
                <Label
                  htmlFor={gender}
                  className={`text-[16px] ${
                    selectedGender === gender
                      ? "font-[600] text-black"
                      : "font-[500] text-gray-500"
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* language */}
        {/* Language */}
        <div className="w-full max-w-md mt-4">
          <div className="mt-[22px]">
            <Label className={`text-[15px] font-medium mb-[7.59px]`}>
              Language Proficiency <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Language"
                className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-3 h-[38px] bg-white placeholder:text-gray-500`}
                value={selectedLanguage}
                readOnly
              />
              <CirclePlus
                size={20}
                className={`w-5 h-5 absolute top-2 right-2`}
                onClick={() => handleAddToList(languageInput, setLanguageInput)}
              />
            </div>
            <ul className="flex flex-wrap gap-[10px] mt-2">
              {selectedLanguage && (
                <li className="flex items-center gap-[5px] py-[2px] px-2 bg-white rounded-[5px] text-[15px] text-gray-500 hover:bg-gray-200">
                  {selectedLanguage}
                  <X
                    className="w-[11px] h-[11px] text-[#776EA5] border border-[#776EA5] rounded-full"
                    onClick={handleRemoveFromList}
                  />
                </li>
              )}
            </ul>
          </div>
          <div className="">
            <Label
              htmlFor="text"
              className="text-[15px] font-medium mb-2 mt-[22px] text-gray-500"
            >
              Suggested Languages
            </Label>
            <div className="flex gap-2 flex-wrap items-center">
              {languageList.map((language, index) => (
                <Button
                  key={index}
                  className="bg-[#776EA5] rounded-[5px] h-6 flex items-center text-[15px] font-medium px-0"
                  onClick={() => handleAddToList(language, setLanguageInput)}
                >
                  {language}
                  <CirclePlus
                    size={11}
                    color="#FFF"
                    className="w-[11px] h-[11px] text-white suggested_languages ml-[-4px]"
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
        {/* language */}

        <div className="bg-gradient-to-b  from-[#fce8e5]  to-[#fce8e5]  flex justify-center items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 max-w-[576px] mx-auto">
          <Button
            onClick={() => {
              setShowFilter(false);
            }}
            className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]   rounded-[8px] flex items-center justify-center w-[46%] h-[45px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-[46%] h-[45px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
