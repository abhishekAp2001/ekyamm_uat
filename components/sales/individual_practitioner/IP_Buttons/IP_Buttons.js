import React, { useState } from "react";
import { Button } from "../../../ui/button";
import { useRouter } from "next/navigation";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../../ui/drawer";
import { X } from "lucide-react";

const IP_Buttons = ({ disabled, onSave, buttonText = "Save & Continue" }) => {
  const router = useRouter()
  const [show,setShow] = useState(false)
  const handleClose = () =>{
    setShow(false)
  }
  const handleCancel = () => {
    router.push("/sales");
    localStorage.removeItem("ip_details")
    localStorage.removeItem("ip_bank_details")
    localStorage.removeItem("ip_general_information")
    localStorage.removeItem("ip_medical_association_details")
    localStorage.removeItem("ip_single_session_fees")
  };

  
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
      {/* <Button
        onClick={() => {
          handleCancel();
        }}
        className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
      >
        Cancel
      </Button> */}

       <Drawer open={show} onClose={()=>handleClose()} className="pt-[9.97px] max-w-[576px] m-auto">
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
        className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center w-[48%] h-[45px]"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default IP_Buttons;
