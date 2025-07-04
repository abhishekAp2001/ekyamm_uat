"use client";
import React, { useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
import Header from "@/components/patient/Header";
import { useRouter } from "next/navigation";
import { Checkbox } from "../../ui/checkbox";
import Image from "next/image";

const Add_Patient = () => {
  const router = useRouter();
  const [sessionType, setSessionType] = useState("Counselling");
  const [sessionMode, setSessionMode] = useState("online");
  const [openConfirmed, setOpenConfirmed] = useState(true);
  const [openUnconfirmed, setOpenUnconfirmed] = useState(true);

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-b space-y-4 from-[#f9f9f9] to-[#ffe7e4] max-w-[576px] mx-auto">
        <Header title="Schedule Session" />
        <div className="bg-gradient-to-b from-[#f9f9f9] to-[#ffe7e4] pt-[18%] lg:pt-[12%] flex-1 overflow-y-auto pb-[60px] ">
          <div className=" px-4 py-0 ">
            <p className="text-[15px] font-medium text-gray-500 mb-[7.59px]">
              Patient
            </p>
            <div className="bg-[#FFFFFF80] py-2 px-3 flex gap-3 items-center rounded-[10px] ">
              <Avatar>
                <AvatarImage src="/images/akshit.png" alt="Shubham Naik" />
                <AvatarFallback>SN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm text-black">Shubham Naik</p>
                <p className="text-xs text-[#6D6A5D]">+91 9876543210</p>
              </div>
            </div>

            <p className="text-[15px] text-gray-500 mb-[7.59px] font-medium  mt-5">
              Assign Practitioner
            </p>
            <div className="bg-[#FFFFFF80] py-2 px-3 flex items-center gap-3 rounded-[10px] ">
              <Avatar>
                <AvatarImage src="/images/akshit.png" alt="Saria Dilon" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm text-black">Saria Dilon</p>
                <p className="text-xs text-[#6D6A5D]">+91 9876543210</p>
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

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="space-y-1">
                <Label
                  htmlFor="session-date "
                  className="text-[15px] text-gray-500 mb-[7.59px] font-medium"
                >
                  Session Date
                </Label>
                <div className="relative">
                  <Input
                    id="session-date"
                    placeholder="MM/DD/YYYY"
                    className="pr-10 bg-white py-[11.93px] rounded-[7.26px] text-sm font-medium"
                  />
                  <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="session-time"
                  className="text-[15px] text-gray-500 mb-[7.59px] font-medium"
                >
                  Session Time Slot
                </Label>
                <div className="relative">
                  <Input
                    id="session-time"
                    placeholder="HH : MM"
                    className="pr-10 bg-white py-[11.93px] rounded-[7.26px] px-4 text-sm font-medium"
                  />
                  <Clock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="terms"
                  className="text-[15px] text-gray-500  font-medium"
                >
                  Accept terms and conditions
                </Label>
                <Checkbox id="terms" />
              </div>
            </div>

            <div className="space-y-1 mt-5">
              <Label
                htmlFor="session-details"
                className="text-[15px] text-gray-500 mb-[7.59px] font-medium"
              >
                Session Details (Optional)
              </Label>
              <textarea
                id="session-details"
                rows={4}
                className="w-full bg-white py-3 px-4 resize-none rounded-[7.26px] border-0 focus-visible:shadow-none focus-visible:outline-0"
                placeholder="Enter session details"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex space-x-4 px-4 fixed bottom-0 left-0 right-0 pb-5 bg-[#fee9e7] max-w-[576px] mx-auto">
          <Drawer className="pt-[9.97px] max-w-[576px] m-auto">
            <Button
              variant="outline"
              className="flex-1 border border-[#CC627B] text-sm text-[#CC627B] rounded-[7.26px]  w-[48%] h-[45px]"
            >
              Cancel
            </Button>
            <DrawerTrigger className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] h-[45px]  rounded-[8px] flex items-center justify-center w-[48%]">
              Confirm
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer p-4 rounded-t-[20px]">
              <div className="flex justify-center w-full">
                <DrawerHeader className="p-0">
                  <DrawerTitle className="text-base text-center font-semibold">
                    Select Session Time
                  </DrawerTitle>
                </DrawerHeader>
                <DrawerClose>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black absolute top-2 right-2"
                  >
                    <X
                      className="w-5 h-5 text-black"
                      color="black"
                      fontWeight={700}
                    />
                  </Button>
                </DrawerClose>
              </div>

              <div className="mb-2 border border-[#e2d7ef] rounded-[12px] bg-[#FFFFFF80] mt-6">
                <button
                  onClick={() => setOpenConfirmed(!openConfirmed)}
                  className="w-full text-left p-4  text-base text-black font-semibold flex justify-between items-center"
                >
                  Confirmed Sessions
                    <span>
                    {openConfirmed ? (
                      <ChevronDown className="w-5 h-5 text-[#00000066]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#00000066]" />
                    )}
                  </span>
                </button>
                {openConfirmed && (
                  <div className="px-4 pb-3 text-sm text-[#555] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#CC627B]">
                        Session 1: 11:00 AM | Fri, 16 April 2025
                      </span>
                      <span className="text-[#1DA563] text-xs font-medium flex items-center gap-1">
                        <Check className="bg-[#11805D] text-white w-[12px] h-[12px] p-[1px] rounded-full" />
                        Confirmed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#CC627B]">
                        Session 3: 11:00 AM | Fri, 26 April 2025
                      </span>
                      <span className="text-[#1DA563] text-xs font-medium flex items-center gap-1">
                        <Check className="bg-[#11805D] text-white w-[12px] h-[12px] p-[1px] rounded-full" />
                        Confirmed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#CC627B]">
                        Session 4: 11:00 AM | Fri, 3 May 2025
                      </span>
                      <span className="text-[#1DA563] text-xs font-medium flex items-center gap-1">
                        <Check className="bg-[#11805D] text-white w-[12px] h-[12px] p-[1px] rounded-full" />
                        Confirmed
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3 border border-[#e2d7ef] rounded-[12px] bg-[#FFFFFF80] ">
                <button
                  onClick={() => setOpenUnconfirmed(!openUnconfirmed)}
                  className="w-full text-left p-4 text-base text-black font-semibold flex justify-between items-center"
                >
                  Unconfirmed Sessions{" "}
                  <span>
                    {openUnconfirmed ? (
                      <ChevronDown className="w-5 h-5 text-[#00000066]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#00000066]" />
                    )}
                  </span>
                </button>
                {openUnconfirmed && (
                  <div className="px-4 pb-3 text-sm text-[#555] space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#CC627B]">
                          Session 2:
                        </span>
                        <div className="rounded-full  w-fit h-6 inline-block bg-gradient-to-r  from-[#B0A4F5] to-[#EDA197] p-[1px]">
                          <button className="bg-[#f8f0ef] text-[11px] text-black rounded-full w-full h-full flex items-center justify-center gap-1 px-2">
                            + Book Session
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-sm font-medium flex gap-[2px] items-center">
                          {" "}
                          <Image
                            src="/images/error_circle.png"
                            width={16}
                            height={16}
                            className="w-4"
                            alt="error"
                          />{" "}
                          Not Available
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DrawerFooter className="flex justify-between pt-2 p-0">
                <DrawerClose className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="border border-[#CC627B] text-[#CC627B] rounded-[7.26px] w-[48%] h-[45px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled
                    className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[15px] font-[600] py-[14.5px] h-[45px] rounded-[8px] w-[48%]"
                  >
                    Go To Dashboard
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default Add_Patient;
