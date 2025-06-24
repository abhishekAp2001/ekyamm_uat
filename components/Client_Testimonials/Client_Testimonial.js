import React from "react";
import Client_Header from "../Client_Header/Client_Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Client_Testimonial = () => {
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] min-h-screen w-full px-4">
      <Client_Header />
      <div className="pt-[16%] lg:pt-[10%]">
      <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
        <AccordionItem value="item-1" className="rounded-[12px] bg-white px-4 py-3">
          <AccordionTrigger className="flex items-start justify-between gap-2 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-muted-foreground">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-black">Priya Kapoor</p>
                <span className="text-[10px] font-medium bg-[#fce8e5] text-black px-2 py-[2px] rounded-[8px]">
                  Verified
                </span>
              </div>
             
            </div>
          </AccordionTrigger>
          <AccordionContent className='pb-0' >
           <p className="text-sm text-black text-left mt-2 leading-snug font-normal">
                Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjudaLorem Ipsum whatsa asjudaLorem Ipsum whatsa asjudaLorem Ipsum whatsa asjuda
              </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="rounded-[16px] bg-white px-4 py-3">
          <AccordionTrigger className="flex items-start justify-between gap-2 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-muted-foreground">
             <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-black">Nexus Dsliva</p>
                <span className="text-[10px] font-medium bg-[#fce8e5] text-black px-2 py-[2px] rounded-[8px]">
                  Verified
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent >
           <p className="text-sm text-black text-left mt-2 leading-snug font-normal">
                Lorem Ipsum whatsa asjuda Lorem Ipsum whatsa asjudaLorem Ipsum whatsa asjudaLorem Ipsum whatsa asjudaLorem Ipsum whatsa asjuda
              </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  );
};

export default Client_Testimonial;
