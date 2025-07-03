"use client";
import React, { useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  IndianRupee,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import Footer_bar from "../Footer_bar/Footer_bar";
import {
  patientSessionData as getPatientSessionData,
  selectedCounsellorData as getSelectedCounsellorData
} from "@/lib/utils";
const Select_Package = () => {
  const router = useRouter();
  const patientSessionData = getPatientSessionData();
  const selectedCounsellorData = getSelectedCounsellorData();
  console.log("selected counsellor data", selectedCounsellorData);
  const [sessionType, setSessionType] = useState("Counselling");
  const [sessionMode, setSessionMode] = useState("online");
  const [openConfirmed, setOpenConfirmed] = useState(true);
  const [openUnconfirmed, setOpenUnconfirmed] = useState(true);
  const [totalPrice, setTotalPrice] = useState(selectedCounsellorData?.practiceDetails?.fees?.singleSession);

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-b space-y-4 from-[#f9f9f9] to-[#ffe7e4] max-w-[576px] mx-auto">
        <div className="flex items-center gap-1 p-4 bg-[#faf7f7] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-10">
          <ChevronLeft
            onClick={() => {
              router.push("/patient/dashboard");
            }}
            size={24}
            className=" text-black-700"
          />
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            Select Package
          </div>
          <div className="h-6 w-6" />
        </div>
        <div className="bg-gradient-to-b from-[#f9f9f9] to-[#ffe7e4] pt-[18%] lg:pt-[10%] flex-1 overflow-y-auto pb-[110px] ">
          <div className=" px-4 py-0 ">
            <div className="bg-[#FFFFFF80] p-4 rounded-[12px]">
              <p className="text-[15px] font-medium text-gray-500 mb-[7.59px]">
                Patient
              </p>
              <div className="bg-[#FFFFFF80] py-2 px-3 flex gap-3 items-center rounded-[10px] ">
                <Avatar>
                  <AvatarImage
                    className="rounded-full object-cover w-[42px] h-[42px]"
                    src={patientSessionData?.profileImageUrl}
                    alt={`${patientSessionData?.firstName || ""} ${patientSessionData?.lastName || ""
                      }`}
                  />
                  <AvatarFallback>
                    {`${patientSessionData?.firstName || ""} ${patientSessionData?.lastName || ""
                      }`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm text-black">
                    {`${patientSessionData?.firstName || ""} ${patientSessionData?.lastName || ""
                      }`}
                  </p>
                  <p className="text-xs text-[#6D6A5D]">{`${patientSessionData?.countryCode_primary.match(/\d+$/)
                      ? "+" +
                      patientSessionData.countryCode_primary.match(
                        /\d+$/
                      )[0]
                      : "+91"
                    } ${patientSessionData?.primaryMobileNumber || ""}`}</p>
                </div>
              </div>

              <p className="text-[15px] text-gray-500 mb-[7.59px] font-medium  mt-5">
                Assign Practitioner
              </p>
              <div className="bg-[#FFFFFF80] py-2 px-3 flex items-center gap-3 rounded-[10px] ">
                <Avatar>
                  <AvatarImage
                    className="rounded-full object-cover w-[42px] h-[42px]"
                    src={
                      selectedCounsellorData?.generalInformation
                        ?.profileImageUrl || ""
                    }
                    alt={`${selectedCounsellorData?.generalInformation?.firstName ||
                      ""
                      } ${selectedCounsellorData?.generalInformation?.lastName || ""
                      }`}
                  />
                  <AvatarFallback>
                    {`${selectedCounsellorData?.generalInformation?.firstName ||
                      ""
                      } ${selectedCounsellorData?.generalInformation?.lastName || ""
                      }`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm text-black">
                    {`${selectedCounsellorData?.generalInformation?.firstName ||
                      ""
                      } ${selectedCounsellorData?.generalInformation?.lastName || ""
                      }`}
                  </p>
                  <p className="text-xs text-[#6D6A5D]">{`${selectedCounsellorData?.generalInformation?.countryCode_primary.match(
                    /\d+$/
                  )
                      ? "+" +
                      selectedCounsellorData?.generalInformation?.countryCode_primary.match(
                        /\d+$/
                      )[0]
                      : "+91"
                    } ${selectedCounsellorData?.generalInformation
                      ?.primaryMobileNumber || ""
                    }`}</p>
                </div>
              </div>

              <div className="mt-5">
                <Label
                  htmlFor="session-type"
                  className=" text-[15px] text-gray-500 mb-[7.59px] "
                >
                  Session Type
                </Label>
                <Select
                  value={sessionType}
                  onValueChange={(v) => setSessionType(v)}
                >
                  <SelectTrigger
                    id="session-type"
                    className="w-full h-[39px] rounded-[7.26px] bg-white p-4 text-sm font-semibold text-black"
                  >
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-xs font-semibold">
                      <SelectItem
                        value="Counselling"
                        className="text-xs font-semibold px-5"
                      >
                        Counselling ( 1 hour )
                      </SelectItem>
                      <SelectItem value="Therapy">Therapy</SelectItem>
                      <SelectItem value="Check-up">Check-up</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5 ">
              <Label className="text-[16px] font-semibold text-black mb-[7.59px]">
                Select Number of Sessions
              </Label>
              <div className="bg-[#FFFFFF80] p-4 rounded-[12px] flex flex-col gap-[10px]">
                {selectedCounsellorData?.practiceDetails?.fees?.packages?.map(
                  (packageItem, idx) => (
                    <div className="flex items-center space-x-2" key={idx}>
                      <Checkbox id={`package-${idx}`}
                        onCheckedChange={() => {
                          setTotalPrice(packageItem.rate);
                        }}
                      />
                      <Label
                        htmlFor={`package-${idx}`}
                        className="text-base font-semibold text-black"
                      >
                        {packageItem?.sessions} Sessions
                      </Label>
                    </div>
                  )
                )}

              </div>
            </div>

            <div className="mt-5">
              <Label className="text-[16px] text-black font-semibold mb-[7.59px]">
                Select Session Fees
              </Label>
              <div className="bg-[#FFFFFF80] rounded-[12px] p-4">
                <Label className="text-[14px] text-gray-500 mb-[7.59px]">
                  Session Fee (Hourly)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter Session Fees"
                    className="w-full h-[39px] rounded-[7.26px] bg-white p-4 ps-7 text-sm font-semibold placeholder:text-gray-500 placeholder:font-medium text-black"
                    value={totalPrice}
                  />
                  <IndianRupee
                    className="absolute top-2 left-3 text-[#00000066]"
                    fontSize={14}
                    width={14}
                    hanging={14}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8  px-4 fixed bottom-0 left-0 right-0 pb-5 bg-[#fee9e7] max-w-[576px] mx-auto">
          <div className="flex space-x-4 pb-4">
            {/* <Button
              variant="outline"
              className="flex-1 border border-[#CC627B] text-sm text-[#CC627B] rounded-[7.26px]  w-[48%] h-[45px]"
            >
              Cancel
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
              className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] h-[45px]  rounded-[8px] flex items-center justify-center w-[48%]"
              onClick={() => {
                router.push("/patient/riskyrash/pay-for-sessions");
              }}
            >
              Generate Invoice
            </Button>
          </div>
          <Footer_bar />
        </div>
      </div>
    </>
  );
};

export default Select_Package;
