"use client";
import React, { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
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
const Add_Patient = () => {
  const router = useRouter();
  const [sessionType, setSessionType] = useState("Counselling");
  const [sessionMode, setSessionMode] = useState("online");
  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-b space-y-4 from-[#f9f9f9] to-[#ffe7e4] max-w-[576px] mx-auto">
        {/* Back Header */}
        <Header title="Schedule Session" />

        <div className="bg-gradient-to-b from-[#f9f9f9] to-[#ffe7e4] pt-[18%] lg:pt-[12%] flex-1 overflow-y-auto pb-[60px] ">
          <div className=" px-4 py-0 ">
            {/* Patient */}
            <p
              htmlFor=""
              className="text-[15px] font-medium text-gray-500 mb-[7.59px]"
            >
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

            {/* Assign Practitioner */}
            <p
              htmlFor=""
              className="text-[15px] text-gray-500 mb-[7.59px] font-medium  mt-5"
            >
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

            {/* Session Type */}
            <div className="mt-5">
              <Label
                htmlFor="session-type"
                className=" text-[15px] text-gray-500 mb-[7.59px] "
              >
                Session Type
              </Label>
              <Select
                className="mt-5 "
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

            {/* Session Mode */}
            {/* <div className="mt-5">
          <Label className=" text-[15px] text-gray-500 mb-[7.59px] ">Session Mode</Label>
          <RadioGroup
            value={sessionMode}
            onValueChange={(v) =>
              setSessionMode(v)
            }
            className="flex space-x-6 text-base font-semibold mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="r-inperson" />
              <Label htmlFor="r-inperson" className="cursor-pointer">
                In-Person
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="r-online" />
              <Label htmlFor="r-online" className="cursor-pointer">
                Online
              </Label>
            </div>
          </RadioGroup>
        </div> */}

            {/* Date & Time */}
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
                    className="pr-10 bg-white py-[11.93px] rounded-[7.26px] px-4 text-sm font-medium
"
                  />
                  <Clock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Online Session Link */}
            {/* {sessionMode === "online" && (
          <div className="space-y-1 mt-5">
            <Label htmlFor="session-link" className="text-[15px] text-gray-500 mb-[7.59px] font-medium">
              Online Session Link or WhatsApp Number
            </Label>
            <Input
              id="session-link"
              placeholder="Add Online Session Link or WhatsApp Number"
              className="w-full bg-white text-xs font-medium py-0 px-4 rounded-[7.26px] placeholder:text-sm placeholder:text-gray-500 text-black h-[39px]"
            />
          </div>
        )} */}

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

            {/* Session Details */}
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
          {/* <Button className="flex-1 bg-gradient-to-r from-[#BBA3E4]  to-[#E7A1A0] text-white rounded-[7.26px] h-[45px]" onClick={()=>{
            router.push("/bookings")
        }}>
          Confirm
        </Button> */}

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
            <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
              <DrawerHeader>
                <DrawerTitle className="text-base text-center font-semibold">
                  Select Session Time
                </DrawerTitle>
              </DrawerHeader>
            
              <DrawerFooter className="p-0">
                {/* <Button>Submit</Button> */}
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
        </div>
      </div>
    </>
  );
};

export default Add_Patient;
