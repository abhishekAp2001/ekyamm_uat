import React from 'react'
import { Button } from './ui/button'
import { MapPin, Phone } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const UpcomingSession = ({sessions}) => {
  return (
   <div>
    <h2 className="text-sm px-4  mt-2 font-semibold mb-2">Upcoming Sessions</h2>
    <Accordion
      type="single"
      collapsible
      className="px-4"
      defaultValue="upcoming relative"
    >
      <AccordionItem
        value="upcoming"
        className="bg-white rounded-lg shadow-md overflow-hidden bg-[#FFFFFF80]"
      >
        <AccordionTrigger className="flex items-center gap-4 p-4 no-underline hover:no-underline focus:no-underline active:no-underline focus-visible:no-underline">
          <div className="">
          <div className="flex flex-col">
            <p className="text-[16px] font-bold text-gray-800">
              {sessions.time}
            </p>
            <p className="text-sm text-gray-500">{sessions.location}</p>
          </div>
          </div>
          <div className="border-gray-300 border w-[1px] h-[56px]"></div>
          <div className="">
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
          <div className="py-2 text-sm">
            <p className="text-gray-500 text-sm">
              <span className="font-medium">Session Duration:</span>{" "}
              {sessions.duration}
            </p>
            <div className="flex items-center">
              <p className="text-gray-500 text-sm">
                <span className="font-medium">Session Mode:</span>{" "}
                {sessions.mode}
              </p>
              <MapPin
                size={16}
                className="bg-[#776EA5] text-white rounded-full p-1 ml-1"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center mt-2">
            <Button className=" bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white px-4 py-2 rounded-lg">
              Mark as Completed
            </Button>
            <p className="text-sm text-gray-500">
              Previous Session: {sessions.previousSession}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
  )
}

export default UpcomingSession
