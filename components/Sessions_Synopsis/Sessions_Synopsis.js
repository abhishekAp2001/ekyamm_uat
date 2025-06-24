"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import SS_Header from "../SS_Header/SS_Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Sessions_Synopsis = () => {
  const sessionDates = [
    "21 March 2022",
    "21 March 2022",
    "03 February 2022",
    "01 February 2022",
    "23 January 2022",
  ];

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col">
      <SS_Header />
      <div className="h-full overflow-y-auto px-[17px]">
        {/* Profile Card */}
        <div className="mb-6 bg-[#FFFFFF80] rounded-[9px] p-3 mt-6">
          <div className="flex items-center gap-4">
            <Image src="/images/rectangle.png" width={42} height={42} alt="chat" />
            <div>
              <p className="text-[14px] font-[600] text-black">Kiran Rathi</p>
              <p className="text-[11px] font-[500] text-gray-500">+91 9876543210</p>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {sessionDates.map((date, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="bg-[#FFFFFF80] rounded-[9px]"
            >
              <AccordionTrigger className="px-4 py-4 text-[14px] font-[600] text-black flex justify-between">
                {date}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-gray-600">
                Session notes or details will appear here.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Done Button */}
        <div className="mt-6 pb-6">
          <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sessions_Synopsis;
