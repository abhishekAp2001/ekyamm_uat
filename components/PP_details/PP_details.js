"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import PP_Header from "../PP_Header/PP_Header";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
const PP_Details = () => {
  const [mobile, setMobile1] = useState("");
  const [whatsapp_mobile, setMobile2] = useState("");
  const [emergency_mobile, setMobile3] = useState("");
  const [selected, setSelected] = useState({
    code: "+91",
    name: "India",
    flag: "/images/india.png",
  });
  const [open, setOpen] = useState(false);

  const countries = [
    { code: "+91", name: "India", flag: "/images/india.png" },
    { code: "+1", name: "USA", flag: "/images/usa.png" },
    { code: "+44", name: "UK", flag: "/images/uk.png" },
    { code: "+61", name: "Australia", flag: "/images/aus.png" },
  ];

  const isDisabled = true;

  const handleInputChange = (e, setter) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setter(digitsOnly);
    }
  };

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
      <PP_Header />
      <div className="h-full pb-[26%] overflow-auto px-[17px]">
        {/* Profile Section */}
        <div className="flex justify-center w-[140.8px] mx-auto relative mb-6">
          <Image
            src="/images/profile.png"
            width={100}
            height={90}
            className="w-full h-fit"
            alt="profile"
          />
          <Drawer>
            <DrawerTrigger>
              <Image
                src="/images/camera.png"
                width={31}
                height={31}
                className="w-[31px] h-fit absolute bottom-[-10px] right-[-10px]"
                alt="camera"
              />
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] rounded-t-[16px]">
              <DrawerHeader>
                <DrawerTitle className="sr-only">Choose Photo</DrawerTitle>
                <DrawerDescription className="flex flex-col gap-3">
                  {["Take Photo", "Choose Photo", "Delete Photo"].map(
                    (text, idx) => (
                      <Button
                        key={idx}
                        className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px] rounded-[8.16px]"
                      >
                        <Link href="">{text}</Link>
                        <Image
                          src="/images/arrow.png"
                          width={24}
                          height={24}
                          alt="arrow"
                        />
                      </Button>
                    )
                  )}
                </DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Form */}
        <div className="rounded-[12px]">
          {/* First Name */}
          <Label className="text-[15px] text-gray-500 mb-[7.59px] mt-5">
            First Name *
          </Label>
          <Input
            placeholder="Shubham"
            className="bg-white rounded-[7.26px] text-[15px] font-semibold  w-full h-[38px]"
          />

          {/* Last Name */}
          <Label className="text-[15px] text-gray-500 mb-[7.59px] mt-[22px]">
            Last Name
          </Label>
          <Input
            placeholder="Thakur"
            className="w-full bg-white rounded-[7.26px] text-[15px] font-semibold h-[39px]"
          />

          {/* Primary Mobile */}
          <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
            Primary Mobile Number <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2 relative">
            <div className="relative w-[82px]">
              <div
                onClick={() => {
                  if (!isDisabled) setOpen(!open);
                }}
                className={`flex items-center gap-1 pl-2 pr-4 py-2 bg-white border border-gray-300 rounded-[7.26px] h-[38px] ${
                  isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <Image
                  src={selected.flag}
                  alt={selected.name}
                  width={16}
                  height={16}
                />
                <span className="ml-1 font-semibold text-[16px]">
                  {selected.code}
                </span>
                <Image
                  src="/images/arrow.png"
                  alt="dropdown"
                  width={13}
                  height={10}
                  className="rotate-90 ml-[7px]"
                />
              </div>
            </div>
            <Input
              type="text"
              value={mobile}
              onChange={(e) => handleInputChange(e, setMobile1)}
              placeholder="Enter Mobile Number"
              className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-gray-500 font-semibold py-2 px-4 h-[39px] w-full opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          {/* WhatsApp Number */}
          <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
            Whatsapp Number
          </Label>
          <div className="flex items-center gap-2 relative">
            <div className="relative w-[82px]">
              <div
                onClick={() => {
                  if (!isDisabled) setOpen(!open);
                }}
                className="flex items-center gap-1 pl-2 pr-4 py-2 bg-white border border-gray-300 rounded-[7.26px] h-[38px] cursor-pointer"
              >
                <Image
                  src={selected.flag}
                  alt={selected.name}
                  width={16}
                  height={16}
                />
                <span className="ml-1 font-semibold text-[16px]">
                  {selected.code}
                </span>
                <Image
                  src="/images/arrow.png"
                  alt="dropdown"
                  width={13}
                  height={10}
                  className="rotate-90 ml-[7px]"
                />
              </div>
            </div>

            <Input
              type="text"
              value={mobile}
              onChange={(e) => handleInputChange(e, setMobile1)}
              placeholder="Enter Mobile Number"
              className="bg-white border border-gray-300 rounded-[7.26px] placeholder:text-gray-500 font-semibold py-2 px-4 h-[38px] w-full"
              maxLength={10}
              inputMode="numeric"
              pattern="\d*"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col mb-4 mt-[24px]">
            <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px]">
              Gender <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-6 items-center text-gray-600 text-[15px]">
              <Label className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="gender"
                  value="male"
                  className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4"
                />
                Male
              </Label>

              <Label className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="gender"
                  value="female"
                  className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4"
                />
                Female
              </Label>
              <Label className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="gender"
                  value="other"
                  className="form-radio text-[#776EA5] bg-transparent accent-[#000000] w-4 h-4"
                />
                Other
              </Label>
            </div>
          </div>

          {/* Email */}
          <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
            Email Address
          </Label>
          <Input
            placeholder="Enter Email address"
            className="w-full bg-white rounded-[7.26px] text-[15px] font-semibold h-[39px]"
          />

          {/* Address Fields */}
          {[
            { label: "Pincode", required: true },
            { label: "Area" },
            { label: "City" },
            { label: "State" },
          ].map(({ label, required }) => (
            <div key={label}>
              <Label className="text-[15px] text-gray-500 font-medium mb-[7.59px] mt-[22px]">
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                placeholder={`Enter ${label} name`}
                className="w-full bg-white rounded-[7.26px] text-[15px] font-semibold h-[39px]"
              />
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] fixed bottom-0 left-0 right-0 flex justify-between gap-3 pb-[23px] px-4 max-w-[576px] mx-auto">
          <Button className="border border-[#CC627B] bg-transparent text-[#CC627B] text-[15px] font-[600] w-[48%] h-[45px] rounded-[8px]">
            Cancel
          </Button>
          <Link href={'/patient-registration/family-details'} className="w-[48%]">
          <Button className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[15px] font-[600] w-full h-[45px] rounded-[8px]">
            Save & Continue
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PP_Details;
