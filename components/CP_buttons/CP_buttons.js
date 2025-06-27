"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

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
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

const CP_buttons = ({ disabled, onSave, buttonText = "Save & Continue" }) => {
  const router = useRouter();
  const [show,setShow] = useState(false)
  const handleClose = () =>{
    setShow(false)
  }
  const handleCancel = () => {
    router.push("/sales");
    deleteCookie("cp_type");
    deleteCookie("cp_clinic_details");
    deleteCookie("cp_doctor_details");
    deleteCookie("cp_billing_details");
    deleteCookie("cp_bank_details");
  };

  return (
    <>
      <div className="bg-[#e8e6f7] flex justify-between items-center gap-3 fixed bottom-0 px-[17px] pb-[18px] left-0 right-0 max-w-[576px] m-auto">
        {/* <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]" onClick={()=>{
          handleCancel()
        }}>
          Cancel
        </Button> */}
        <Drawer open={show} onClose={handleClose} className="pt-[9.97px] max-w-[576px] m-auto">
          <DrawerTrigger onClick={()=>setShow(true)} className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
            Cancel
          </DrawerTrigger>
          <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
            <DrawerHeader>
              <DrawerTitle className="text-[16px] font-[600] text-center">
                By cancelling, you are confirming to not add this partner to be part of Ekyamm
              </DrawerTitle>
              <DrawerDescription className="mt-6 flex gap-3 w-full">
                <Button onClick={()=>handleCancel()} className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                  Confirm
                </Button>

                <Button onClick={()=>handleClose()} className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]">
                  Continue
                </Button>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="p-0">
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Button
          disabled={disabled}
          onClick={() => {
            onSave();
          }}
          className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
        >
          {buttonText}
        </Button>
        <div className="hidden">
          <Button
            disabled={disabled}
            onClick={() => {
              onSave();
            }}
            className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px] "
          >
            Select Counsellor
          </Button>
          <Button
            disabled={disabled}
            onClick={() => {
              onSave();
            }}
            className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px] "
          >
            Add Emergency Contact
          </Button>
        </div>
      </div>
    </>
  );
};

export default CP_buttons;
