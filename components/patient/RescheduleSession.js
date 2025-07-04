import React from "react";
import { Button } from "../ui/button";
import { Link2, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const RescheduleSession = ({ sessions, showRescheduleButtons = false }) => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="mt-3"
        defaultValue="upcoming"
      >
        <AccordionItem
          value="upcoming"
          className="rounded-[12px] bg-[#ffffff80] opacity-80 relative"
        >
          <AccordionTrigger className="flex items-center p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <p className="text-[16px] font-bold text-gray-800 flex flex-col">
                  <span className="text-xs text-[#6D6A5D] font-medium">
                    24th Apr
                  </span>
                  {sessions.time}
                </p>
                <p className="text-xs text-[#6D6A5D] font-medium">
                  {sessions.location}
                </p>
              </div>

              <div className="border-gray-300 border w-[1px] h-[56px] mx-3"></div>

              <div className="flex items-center space-x-3">
                <Avatar className="w-[42px] h-[42px]">
                  <AvatarImage
                    src={sessions?.doctor?.profilePic}
                    alt={sessions?.doctor?.name}
                  />
                  <AvatarFallback>
                    {sessions?.doctor?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-[16px] font-bold text-gray-800">
                    {sessions.doctor.name}
                  </p>
                  <Phone
                    size={28}
                    className="bg-[#776EA5] fill-white text-white rounded-full p-[7px] mt-1"
                  />
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 pb-4 pt-0 border-t">
            <div className="pb-2 text-xs">
              <p className="text-[#6D6A5D] text-xs font-medium">
                <span className="font-medium">Session Duration:</span>{" "}
                {sessions.duration}
              </p>
              <div className="flex items-center">
                <p className="text-[#6D6A5D] text-xs font-medium">
                  <span className="font-medium">Session Mode:</span>{" "}
                  {sessions.mode}
                </p>
                <Link2
                  size={14}
                  className="bg-[#776EA5] text-white rounded-full p-[2px] ml-1"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center mt-2">
              {showRescheduleButtons ? (
                <>
                  <Button
                    disabled
                    className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] opacity-60 text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[138px]"
                  >
                    Start Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#E7A1A0] text-[#E7A1A0] font-semibold text-[14px] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[160px] "
                  >
                    Reschedule Session
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[14px] font-[600] py-[14.5px] h-8 rounded-[8px] flex items-center justify-center w-[138px] "
                  >
                    Start Call
                  </Button>
                  {/* Show "Previous Session" ONLY in single-button mode */}
                  <p className="text-xs text-[#6D6A5D] font-medium">
                    Previous Session: {sessions.previousSession}
                  </p>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RescheduleSession;
