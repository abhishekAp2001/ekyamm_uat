"use client";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
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
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useState } from "react";
const Emergency_Header = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleClose = () => {
    setShow(false);
  };
  const handleBack = () => {
    if (pathname === "/sales/cp_type") {
      router.push("/sales");
    } else if (pathname === "/sales/cp_clinic_details") {
      router.push("/sales/cp_type");
    } else if (pathname === "/sales/cp_doctor_details") {
      router.push("/sales/cp_clinic_details");
    } else if (pathname === "/sales/cp_billing_details") {
      router.push("/sales/cp_doctor_details");
    } else if (pathname === "/sales/cp_bank_details") {
      router.push("/sales/cp_billing_details");
    }
  };
  return (
    <>
      <div className="fixed left-0 right-0 z-10 bg-[#e8e6f7] max-w-[576px] m-auto">
        <div className="flex items-center p-4 gap-[9px]">
          <Button variant="ghost" onClick={() => setShow(true)}>
          <ChevronLeft size={24} className=" text-black-700" />
        </Button>
        <Drawer
          className="pt-[9.97px] max-w-[576px] m-auto"
          open={show}
          onClose={handleClose}
        >
                    <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
                      <DrawerHeader>
                        <DrawerTitle className="text-[16px] font-[600] text-center">
                          Are you sure
                        </DrawerTitle>
                        <DrawerDescription className="mt-6 flex gap-3 w-full">
                          <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
                          onClick={() => handleClose()}>
                            Confirm
                          </Button>
        
                          <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
                          onClick={() => handleClose()}
                          >
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
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            Add Emergency Contact Details
          </div>
          <div className="h-6 w-6" /> {/* Space */}
        </div>
      </div>
    </>
  );
};

export default Emergency_Header;
