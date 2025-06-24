"use client";
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

const Patient_Payment = () => {
  const [paymentMode, setPaymentMode] = useState("card");
  const [saveCard, setSaveCard] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DFDAFB] to-[#F9CCC5] flex flex-col max-w-[576px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 gap-[9px] bg-[#f6f4fd] fixed top-0 left-0 right-0 z-10 max-w-[576px] mx-auto">
        <ChevronLeft size={24} className=" text-black-700" />
        <div className="flex-1 text-[16px] font-semibold text-gray-800">
          Payment
        </div>
        <div className="h-6 w-6" />
      </div>

      {/* Card */}
      <div className="pt-[20%] lg:pt-[14%] overflow-y-auto pb-5">
      <div className="bg-[#FFFFFF61] rounded-[9px] p-4 mx-4 ">
        <p className="text-[14px] font-[500] text-gray-500 mb-2">Pay With:</p>

        {/* Payment Method - ShadCN RadioGroup */}
        <RadioGroup
          defaultValue="card"
          value={paymentMode}
          onValueChange={setPaymentMode}
          className="flex gap-6 mb-5"
        >
          {["Card", "Bank", "UPI"].map((method) => (
            <div className="flex items-center space-x-2" key={method}>
              <RadioGroupItem value={method} id={method} />
              <Label htmlFor={method} className="capitalize text-[14px] font-[600]">
                {method}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Card Number */}
        <div className="mb-4">
          <p className="text-[14px] text-gray-500 font-[500] mb-2">
            Card Number
          </p>
          <Input
            type="text"
            placeholder="Enter card no."
            className="w-full px-3 py-2 text-sm font-medium text-black placeholder-gray-400 bg-white rounded-[7.26px]"
          />
        </div>

        {/* Expiry + CVV */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <p className="text-[14px] placeholder:text-gray-500 text-black font-[500] mb-1">Expiry</p>
            <Input
              type="text"
              placeholder="22/22"
              className="w-full bg-white rounded-[7.26px] px-3 py-2 text-sm font-medium text-black placeholder-gray-400"
            />
          </div>
          <div className="flex-1">
            <p className="text-[14px] placeholder:text-gray-500 text-black font-[500] mb-1">CVV</p>
            <Input
              type="text"
              placeholder="123"
              className="w-full bg-white rounded-[7.26px] px-3 py-2 text-sm font-medium text-black placeholder-gray-400"
            />
          </div>
        </div>

        {/* Save Card */}
        <label className="flex items-center mb-6 text-sm text-gray-500 font-[500]">
          <Checkbox
            type="checked"
            className="mr-2 accent-[#776EA5]"
          />
          
          Save card details
        </label>

        {/* Pay Button */}
        <button className="w-full h-[45px] py-3 rounded-[8px] text-white font-semibold text-[15px] bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0]">
          Pay Now
        </button>
      </div>
    </div>
    </div>
  );
};

export default Patient_Payment;
