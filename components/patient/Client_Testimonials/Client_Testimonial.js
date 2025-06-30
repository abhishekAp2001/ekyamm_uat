import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";

const Client_Testimonial = ({ setShowClientTestimonials, doc }) => {
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] min-h-screen w-full px-4 max-w-[576px] mx-auto">
      <div className="w-full fixed top left-0 right-0 z-10 max-w-[576px] mx-auto bg-[#f0ecf9]">
        <div className="flex items-center gap-[9px] p-4">
          <ChevronLeft
            size={24}
            className="text-black-700"
            onClick={() => {
              setShowClientTestimonials(false);
            }}
          />
          <span className="text-[16px] font-semibold text-gray-800">
            Client Testimonials
          </span>
        </div>
      </div>

      <div className="pt-[16%] lg:pt-[10%]">        
        <Accordion
          type="multiple"
          className="w-full flex flex-col gap-3"
          defaultValue={doc?.testimonials?.map((_, index) => `item-${index}`)}
        >
        {doc?.testimonials?.map((testimonial, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-[16px] bg-white px-4 py-3"
          >
            <AccordionTrigger className="flex items-start justify-between gap-2 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-muted-foreground">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-black">
                    {testimonial.patientName}
                  </p>
                  <span className="text-[10px] font-medium bg-[#fce8e5] text-black px-2 py-[2px] rounded-[8px]">
                    {testimonial.verified? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <p className="text-sm text-black text-left mt-2 leading-snug font-normal">
                {testimonial.feedback}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
      </div>

    </div>
  );
};

export default Client_Testimonial;
