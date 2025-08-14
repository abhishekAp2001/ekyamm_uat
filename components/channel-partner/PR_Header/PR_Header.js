import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import { Button } from "../../ui/button";
import { deleteCookie } from "cookies-next";
import { removeStorage } from "@/lib/utils";

const PR_Header = ({ type, patientType, text, handleCancel }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);

  const handleBack = () => {
    if (
      pathname === `/channel-partner/${type}/patient-registration` ||
      pathname === `/channel-partner/${type}/existing-patient`
    ) {
      router.push(`/channel-partner/${type}`);
    }
    else{
      if(patientType === 1){
        // deleteCookie("invitePatientInfo")
        // deleteCookie("sessions_selection")
        removeStorage("invitePatientInfo")
        removeStorage("sessions_selection")
        router.push(`/channel-partner/${type}/patient-registration`)
      }
      if(patientType === 2){
        setShow(false)
        handleCancel()
      }
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <div className="bg-gradient-to-t from-[#eeecfb] to-[#eeecfb] fixed top-0 left-0 right-0 max-w-[576px] mx-auto z-50">
        <div className="flex items-center p-4 gap-[9px]">
          <ChevronLeft
            size={24}
            className=" text-black-700 cursor-pointer"
            onClick={() => {
              setShow(true);
            }}
          />
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            {text}
          </div>
          <div className="h-6 w-6" /> {/* Space */}
        </div>
      </div>
      <Drawer
        open={show}
        onClose={() => {
          handleClose();
        }}
        className="pt-[9.97px] max-w-[576px] m-auto"
      >
        <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
          <DrawerHeader>
            <DrawerTitle className="text-[16px] font-[600] text-center">
              {patientType === 1
                ? "By cancelling, you are confirming to not add additional session for this patient"
                : "By cancelling, you are confirming to not Invite this patient to avail body-mind-emotional balance"}
            </DrawerTitle>
            <DrawerDescription className="mt-6 flex gap-3 w-full">
              <Button
                onClick={() => {
                  handleBack();
                }}
                className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
              >
                Confirm
              </Button>

              <Button
                onClick={() => handleClose()}
                className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]  rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
              >
                Continue
              </Button>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PR_Header;
