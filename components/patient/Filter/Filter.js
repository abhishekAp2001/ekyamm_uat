"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CirclePlus, ChevronLeft, X, Loader2, FunnelX } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { Input } from "@/components/ui/input";

const Filter = ({
  token,
  setShowFilter,
  onApplyFilter,
  initialParams,
  loading = false,
}) => {
  const axios = axiosInstance();
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [fees, setFees] = useState([])
  const [selectedGender, setSelectedGender] = useState(
    initialParams.gender || ""
  );
  const [languageInput, setLanguageInput] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(initialParams.language || []);
  const [languageList, setLanguageList] = useState([]); // State for API-fetched languages
  const [sessionFee, setSessionFee] = useState(initialParams.sessionFee || "150");
  const [sessionFeeRange, setSessionFeeRange] = useState({ from: "", to: "" });
  useEffect(() => {
    setSelectedGender(initialParams.gender || "");
    const initial = initialParams.language;
    if (initial) {
      if (Array.isArray(initial)) {
        setSelectedLanguages(initial);
      } else {
        setSelectedLanguages([initial]);
      }
    } else {
      setSelectedLanguages([]);
    }
    setSessionFeeRange({
  from: initialParams.sessionFee?.from || "",
  to: initialParams.sessionFee?.to || "",
});
  }, [initialParams]);

  const handleClearFilters = () => {
    setSelectedGender("");
    setSelectedLanguages([]);
    setSessionFeeRange({ from: "", to: "" });
    setLanguageInput("");
    onApplyFilter({
  language: "",
  sessionFee: { from: null, to: null },
  gender: "",
});
  };
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
    const initial = initialParams.language;
    if (initial) {
      if (Array.isArray(initial)) {
        setSelectedLanguages(initial);
      } else {
        setSelectedLanguages([initial]);
      }
    } else {
      setSelectedLanguages([]);
    }
    setSessionFeeRange({
  from: initialParams.sessionFee?.from || "",
  to: initialParams.sessionFee?.to || "",
});
  }, [initialParams]);

  const handleAddToList = (value, setInput) => {
    if (value && !selectedLanguages.includes(value)) {
      setSelectedLanguages([...selectedLanguages, value]);
      setInput("");
    }
  };

  const handleRemoveFromList = (language) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
  };

  const handleApply = () => {
    console.log("in");
    const params = {
  language: selectedLanguages,
  sessionFee: {
    from: sessionFeeRange.from,
    to: sessionFeeRange.to,
  },
  gender: selectedGender || "",
};
    onApplyFilter(params);
  };

  useEffect(() => {
    const getSliderValue = async () => {
      try {
        const response = await axios.get(`/v2/cp/counsellors/fees`, {
          headers: {
            accesstoken: token
          }
        })
        if (response?.data?.success) {
          setMin(response?.data?.data?.min)
          setMax(response?.data?.data?.max)
          setFees(response?.data?.data?.fees)
        }
      } catch (error) {
        console.error(error);
      }
    }
    getSliderValue()
  }, [token])
  const currentIndex = sessionFee === ""
    ? 0
    : fees.findIndex(fee => fee === Number(sessionFee));
  const indexValue = currentIndex === -1 ? 0 : currentIndex;
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] min-h-screen flex flex-col max-w-[576px] mx-auto">
      <>
        <div className=" bg-[#FFFFFF] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-10">
          <div className="flex items-center p-4 pl-3 gap-[9px]">
            <ChevronLeft
              size={28}
              className=" text-black-700 cursor-pointer"
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
      <div className="flex-grow px-4 mt-[18px] pb-[90px] pt-[16%] lg:pt-[10%]" style={{
        background: `
      linear-gradient(180deg, #DFDAFB 0%, #F9CCC5 100%),
      linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
    `
      }}>
        {/* Session Fee */}
        <div className="bg-white rounded-[12px] p-4 mb-[10px]">
          <Button
            onClick={handleClearFilters}
            className="border border-[#CC627B] bg-transparent text-[12px] font-[600] text-[#CC627B] px-[10px] py-0   rounded-[8px] flex items-center justify-center w-fit h-[28px] ml-auto"
            variant="ghost"
          >
           Clear Filter

          </Button>
          <div className="text-[15px] font-[500] text-gray-500 mb-5">
            Session Fee
          </div>
          <Slider
  value={[
    sessionFeeRange.from === "" ? min : Number(sessionFeeRange.from),
    sessionFeeRange.to === "" ? max : Number(sessionFeeRange.to),
  ]}
  onValueChange={(value) => {
    setSessionFeeRange({
      from: value[0],
      to: value[1],
    });
  }}
  min={min}
  max={max}
  step={100}
/>
          <div className="flex justify-between mt-2 text-[12px] text-[#6D6A5D] font-[500]">
            <span>₹{min}/-</span>
            <span>₹{max}/-</span>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-4 mb-[10px]">
          <div className="text-[15px] font-[500] text-gray-500 mb-2">
            Gender
          </div>
          <RadioGroup
            value={selectedGender}
            onValueChange={(value) =>
              setSelectedGender(value === selectedGender ? "" : value)
            }
            className="flex gap-4 items-center"
          >
            {["male", "female", "other"].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem value={gender} id={gender} />
                <Label
                  htmlFor={gender}
                  className={`text-[16px] ${selectedGender === gender
                      ? "font-[600] text-black"
                      : "font-[500] text-gray-500"
                    } cursor-pointer`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* language */}
        {/* Language */}
        <div className="w-full mt-4 bg-white rounded-[12px] p-4">
          <div className="">
            <Label className={`text-[15px] font-medium mb-[7.59px]`}>
              Select Preferred Language
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Language"
                className="..."
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
              />
              <CirclePlus
                size={20}
                className={`cursor-pointer w-5 h-5 absolute top-2 right-2`}
                onClick={() => handleAddToList(languageInput, setLanguageInput)}
              />
            </div>
            <ul className="flex flex-wrap gap-[10px] mt-2">
              {selectedLanguages.map((language, index) => (
                <li
                  key={index}
                  className="flex items-center gap-[5px] py-[2px] px-2 bg-[#BBA3E41A] rounded-[5px] text-[15px] text-gray-500 hover:bg-gray-200"
                >
                  {language}
                  <X
                    className="w-[11px] h-[11px] text-[#776EA5] border border-[#776EA5] rounded-full"
                    onClick={() => handleRemoveFromList(language)}
                  />
                </li>
              ))}
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
                    className="cursor-pointer w-[11px] h-[11px] text-white suggested_languages ml-[-4px] circle_plus"
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
        {/* language */}

        <div className="bg-[#f6cecb] flex justify-center items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 max-w-[576px] mx-auto">
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
