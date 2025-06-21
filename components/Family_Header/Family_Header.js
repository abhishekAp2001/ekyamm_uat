"use client";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Family_Header = () => {
  const pathname = usePathname();
  const router = useRouter();

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
          <ChevronLeft
            size={24}
            className=" text-black-700"
            onClick={() => {
              handleBack();
            }}
          />
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            Add Family Details
          </div>
          <div className="h-6 w-6" /> {/* Space */}
        </div>
      </div>
    </>
  );
};

export default Family_Header;
