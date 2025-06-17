import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Patient_Header = ({ to = null, title = null }) => {
  const router = useRouter();
  const redirectHandler = (to) => {
    if (to) {
      router.push(to);
    }
  };
  return (
    <>
      <div>
        <div className="flex items-center py-4 px-0 gap-[9px]">
          <ChevronLeft
            size={24}
            className=" text-black-700"
            onClick={() => redirectHandler(to)}
          />
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            {title}
          </div>
          <div className="h-6 w-6" /> {/* Space */}
        </div>
      </div>
    </>
  );
};

export default Patient_Header;
