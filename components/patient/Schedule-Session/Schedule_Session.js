"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { ChevronLeft, ChevronUpIcon } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  patientSessionData as getPatientSessionData,
  selectedCounsellorData as getSelectedCounsellorData,
} from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Schedule_Session = () => {
  const router = useRouter();
  const patientSessionData = getPatientSessionData();
  const selectedCounsellorData = getSelectedCounsellorData();

  const sessionData = [
    {
      value: "morning",
      label: "Morning",
      times: [
        { time: "08:00 AM", disabled: true },
        { time: "09:00 AM", disabled: true },
        { time: "10:00 AM", disabled: false },
        { time: "11:00 AM", disabled: false },
      ],
    },
    {
      value: "afternoon",
      label: "Afternoon",
      times: [
        { time: "12:00 PM", disabled: false },
        { time: "01:00 PM", disabled: false },
        { time: "02:00 PM", disabled: false },
        { time: "03:00 PM", disabled: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] relative max-w-[576px] mx-auto">
      <div className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center px-4 bg-gradient-to-b from-[#eeecfb] to-[#eeecfb] max-w-[576px] mx-auto">
        <ChevronLeft
          size={24}
          className="text-black cursor-pointer"
          onClick={() => {
            router.push(`/patent/dashboard`);
          }}
        />
        <strong className="ml-2 text-[16px] font-semibold text-gray-800">
          Schedule Session
        </strong>
      </div>
      <div className="pt-15 px-4 pb-20 flex justify-center relative">
        <div className="w-full flex flex-col gap-2">
          <div>
            <label className="block text-[#8F8F8F] mb-1 text-[15px]">
              Patient
            </label>
            <div className="w-full bg-[#FFFFFF]/50 rounded-[12px] px-[12px] py-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <Avatar>
                  <AvatarImage
                    className="rounded-full object-cover w-[42px] h-[42px]"
                    src={patientSessionData?.profileImageUrl}
                    alt={`${patientSessionData?.firstName} ${patientSessionData?.lastName}`}
                  />
                  <AvatarFallback>
                    {`${patientSessionData?.firstName} ${patientSessionData?.lastName}`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label className="text-[16px] text-black font-[600] font-['Quicksand']">
                    {`${patientSessionData?.firstName} ${patientSessionData?.lastName}`}
                  </Label>
                  <Label className="text-[15px] text-[#6D6A5D] font-[500] font-['Quicksand']">
                    {`${
                      patientSessionData?.countryCode_primary.match(/\d+$/)
                        ? "+" +
                          patientSessionData.countryCode_primary.match(
                            /\d+$/
                          )[0]
                        : "+91"
                    } ${patientSessionData?.primaryMobileNumber}`}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#8F8F8F] mb-1 text-[15px]">
              Assign Practitioner
            </label>
            <div className="w-full bg-[#FFFFFF]/50 rounded-[12px] px-[12px] py-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <Avatar>
                  <AvatarImage
                    className="rounded-full object-cover w-[42px] h-[42px]"
                    src={
                      selectedCounsellorData?.generalInformation
                        ?.profileImageUrl
                    }
                    alt={`${selectedCounsellorData?.generalInformation?.firstName} ${selectedCounsellorData?.generalInformation?.lastName}`}
                  />
                  <AvatarFallback>
                    {`${selectedCounsellorData?.generalInformation?.firstName} ${selectedCounsellorData?.generalInformation?.lastName}`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label className="text-[16px] text-black font-[600] font-['Quicksand']">
                    {`${selectedCounsellorData?.generalInformation?.firstName} ${selectedCounsellorData?.generalInformation?.lastName}`}
                  </Label>
                  <Label className="text-[15px] text-[#6D6A5D] font-[500] font-['Quicksand']">
                    {`${
                      selectedCounsellorData?.generalInformation?.countryCode_primary.match(
                        /\d+$/
                      )
                        ? "+" +
                          selectedCounsellorData?.generalInformation?.countryCode_primary.match(
                            /\d+$/
                          )[0]
                        : "+91"
                    } ${
                      selectedCounsellorData?.generalInformation
                        ?.primaryMobileNumber
                    }`}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 font-quicksand text-sm bg-gradient-to-br rounded-[16px]">
            <div>
              <Label className="block text-[#8F8F8F] mb-1">Session Type</Label>
              <Input
                type="text"
                placeholder="Enter session type"
                className="w-full h-10 rounded-[7.26px] bg-white px-3 py-2  border border-[#E6E6E6] text-black text-[12px] font-bold focus:border-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 focus-visible:outline-0"
              />
            </div>

            <div className="flex gap-7">
              <div className="flex-1">
                <Label className="block text-[#8F8F8F] mb-1">
                  Session Date
                </Label>
                <div className="relative">
                  <Input
                    disabled
                    placeholder="Enter date"
                    className="w-full h-10 rounded-[7.26px] bg-white px-3 py-2  border border-[#E6E6E6]"
                  />
                  <Image
                    src="/images/calender.jpg"
                    alt="time-icon"
                    width={23}
                    height={20}
                    className="absolute right-3 top-2.5"
                  />
                </div>
              </div>

              <div className="flex-1">
                <Label className="block text-[#8F8F8F] mb-1">
                  Session Time Slot
                </Label>

                <Drawer className="">
                  <DrawerTrigger asChild>
                    <div className="relative">
                      <Input
                        readOnly
                        placeholder="HH : MM"
                        className="opacity-50 w-full h-10 rounded-[7.26px] bg-white px-3 py-2  border border-[#E6E6E6] cursor-pointer"
                      />
                      <Image
                        src="/images/Time2.png"
                        alt="time-icon"
                        width={23}
                        height={20}
                        className="absolute  right-3 top-2.5"
                      />
                    </div>
                  </DrawerTrigger>

                  <DrawerContent className="max-w-[576px] mx-auto h-auto bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] absolute">
                    <DrawerTitle className="sr-only">
                      Select Session Time
                    </DrawerTitle>

                    <div className="w-full bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] rounded-tl-lg rounded-tr-lg p-4 flex flex-col justify-between shadow-lg">
                      <div className="relative">
                        <h2 className="text-[16px] font-semibold text-center w-full">
                          Select Session Time
                        </h2>

                        <DrawerClose asChild>
                          <Button
                            type="button"
                            className="absolute right-0 top-0 z-50"
                          >
                            <Image
                              src="/images/close.png"
                              alt="close"
                              width={24}
                              height={24}
                            />
                          </Button>
                        </DrawerClose>

                        <div className="w-full h-[18px] gap-3 mx-auto flex items-center justify-center mt-3">
                          <Image
                            src="/images/Union.png"
                            alt="left-arrow"
                            width={10}
                            height={6}
                            className="relative mb-4  rotate-180 w-[9px]"
                          />
                          <p className="text-[#776EA5] font-semibold text-[15px] leading-[18px] text-center mb-4">
                            Friday, 16 April 2025
                          </p>
                          <Image
                            src="/images/Unions.png"
                            alt="right"
                            width={10}
                            height={6}
                            className="relative mb-4 w-[9px]"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full focus-visible:border-0 focus-visible:shadow-none focus-visible:ring-0 focus:shdow-none"
                          defaultValue="morning"
                        >
                          {sessionData.map((session) => (
                            <AccordionItem
                              className="bg-white opacity-60 p-4 rounded-[12px] mb-[10px] hover:decoration-0 focus-visible:ring-0 focus:shdow-none "
                              key={session.value}
                              value={session.value}
                            >
                              <AccordionTrigger>
                                {session.label}
                              </AccordionTrigger>
                              <AccordionContent className="flex flex-wrap gap-2 pt-3 pb-0">
                                {session.times.map((slot, index) => (
                                  <Button
                                    key={index}
                                    disabled={slot.disabled}
                                    className={`px-2 py-2 rounded-[8px] border text-sm font-medium text-black hover:decoration-0 focus-visible:border-0 focus-visible:shadow-none focus-visible:ring-0 focus:shdow-none cursor-pointer
                                        ${
                                          slot.disabled
                                            ? "text-pink-300 border-pink-300 bg-white-100 cursor-not-allowed"
                                            : "text-pink-600 border-pink-300 hover:bg-pink-50 bg-transparent"
                                        }`}
                                  >
                                    {slot.time}
                                  </Button>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>

                      <div className="flex justify-between gap-4 mt-4">
                        <button className="border border-[#CC627B] text-[#CC627B] rounded-[8px] text-[15px] font-[600] w-1/2 h-[45px]">
                          Cancel
                        </button>
                        <button className="opacity-35 bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white rounded-[8px] text-[15px] font-[600] w-1/2 h-[45px]">
                          Confirm
                        </button>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[#8F8F8F]">
                Weekly Recurring Sessions
              </label>
              <Checkbox className="h-4 w-[16.05px] border-[1.5px] border-[#776EA5] rounded-[1.7px]" />
            </div>

            <div>
              <label className="block text-[#8F8F8F] mb-1">
                Session Details (Optional)
              </label>
              <textarea
                placeholder="Enter session details here"
                disabled
                className="w-full h-[100px] rounded-[7.26px] bg-white px-3 py-2 border border-[#E6E6E6] opacity-50"
              />
            </div>
          </div>

          <div className="gap-3 fixed bottom-0 pb-[23px] left-0 right-0 flex justify-center z-50 bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] max-w-[576px] mx-auto px-4 ">
            <button className="border border-[#CC627B] text-[#CC627B] rounded-[8px] text-[15px] font-[600] w-[48%] h-[45px]">
              Cancel
            </button>
            <button className="opacity-35 bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white rounded-[8px] text-[15px] font-[600] w-[48%] h-[45px]">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule_Session;
