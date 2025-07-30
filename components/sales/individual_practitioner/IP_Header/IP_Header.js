import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useRememberMe } from "@/app/context/RememberMeContext";
const IP_Header = ({ text }) => {
  const { rememberMe } = useRememberMe()
  const pathname = usePathname();
  const router = useRouter();
  const doNotHaveMedicalAssociation = rememberMe ? (localStorage.getItem("doNotHaveMedicalAssociation")==="true") : (sessionStorage.getItem("doNotHaveMedicalAssociation")==="true");
  const handleBack = () => {
    if (pathname === "/sales/ip_details") {
      router.push("/sales");
    } else if (pathname === "/sales/ip_general_information") {
      router.push("/sales/ip_details");
    } else if (pathname === "/sales/ip_medical_association_details") {
      router.push("/sales/ip_general_information");
    } else if (pathname === "/sales/ip_medical_association_certificate") {
      router.push("/sales/ip_medical_association_details");
    } else if (pathname === "/sales/ip_single_session_fees") {
      if(doNotHaveMedicalAssociation){
        router.push("/sales/ip_general_information");
      }
      else{
        router.push("/sales/ip_medical_association_certificate");
      }
    } else if (pathname === "/sales/ip_bank_details") {
      router.push("/sales/ip_single_session_fees");
    } 
  };
  return (
    <>
      <div className="">
        <div className="flex items-center p-4 gap-[9px]">
          <ChevronLeft
            size={24}
            className=" text-black-700"
            onClick={() => {
              handleBack();
            }}
          />
          <div className="flex-1 text-[16px] font-semibold text-gray-800">
            {text}
          </div>
          <div className="h-6 w-6" /> {/* Space */}
        </div>
      </div>
    </>
  );
};

export default IP_Header;
