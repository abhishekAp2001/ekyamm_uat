import React from "react";
import { Button } from "@/components/ui/button";

const PR_buttons = () => {
  return (
    <>
      <div className="bg-gradient-to-t  from-[#e5e3f5] via-[#f1effd] via-50%  to-[#e5e3f5]  flex justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0">
        <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  mx-auto rounded-[8px] flex items-center justify-center w-[42%] h-[45px]">
          Existing Patient
        </Button>
       <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  mx-auto rounded-[8px] flex items-center justify-center w-[42%] h-[45px]">
        + Patient History
        </Button>
      </div>
    </>
  );
};

export default PR_buttons;
