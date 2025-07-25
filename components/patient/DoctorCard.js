import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/utils";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useRememberMe } from "@/app/context/RememberMeContext";
const DoctorCard = ({
  patient,
  doc,
  onBookClick,
  setShowCounsellorProfile,
  setSelectedCounsellors,
}) => {
  const {rememberMe} = useRememberMe()
  const router = useRouter();
  const handleBookNowClick = () => {
    let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
    setCookie("selectedCounsellor", JSON.stringify(doc),maxAge);
    if (patient.availableCredits === 0) {
      router.push("/patient/select-package")
    }
    else {
      router.push("/patient/schedule-session");
    }
  }
  return (
    <AccordionItem
      value={`item-${doc?.loginId}`}
      className="rounded-[12px] overflow-hidden bg-white opacity-80 relative"
    >
      <AccordionTrigger className="flex items-center justify-between bg-white rounded-xl p-[12px] pb-[10px] no-underline hover:no-underline focus:no-underline active:no-underline focus-visible:no-underline">
        <div className="flex items-center space-x-3">
          {}
          <Avatar
          onClick={() => {
                  setSelectedCounsellors(doc);
                  setShowCounsellorProfile(true);
                }}>
            <AvatarImage
              src={doc?.generalInformation?.profileImageUrl}
              alt={`${doc?.generalInformation?.firstName} ${doc?.generalInformation?.lastName}`}
            />
            <AvatarFallback>
              {`${doc?.generalInformation?.firstName} ${doc?.generalInformation?.lastName}`
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-[8.9px]">
              <h2
                className="text-sm font-semibold text-black"
                onClick={() => {
                  setSelectedCounsellors(doc);
                  setShowCounsellorProfile(true);
                }}
              >{`${doc?.generalInformation?.firstName} ${doc?.generalInformation?.lastName}`}</h2>
              {doc?.practiceDetails?.yearsOfExperience ? (
                <div className="w-[59px] h-[16px] bg-[#F9CCC5] rounded-[8px] flex items-center justify-center">
                  <span className="text-[8px] font-medium">
                    {doc?.practiceDetails?.yearsOfExperience}+ Years Exp
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
            <p className="text-xs font-medium text-[#6D6A5D] py-[2px]">
              {doc?.generalInformation?.city}, {doc?.generalInformation?.state}
            </p>
            <p className="text-xs font-medium text-[#6D6A5D]">
              {Array.isArray(doc?.practiceDetails?.languageProficiency)
                ? doc.practiceDetails.languageProficiency.map((lang, _lx) => (
                    <span
                      key={_lx}
                      className={`${
                        _lx === 0 ? "text-sm text-[#776EA5] font-black" : ""
                      }`}
                    >
                      {lang?.trim() || ""}{" "}
                    </span>
                  ))
                : doc.practiceDetails.languageProficiency
                    ?.split(",")
                    ?.map((lang, _lx) => (
                      <span
                        key={_lx}
                        className={`${
                          _lx === 0 ? "text-sm text-[#776EA5] font-black" : ""
                        }`}
                      >
                        {lang?.trim() || ""}{" "}
                      </span>
                    ))}
            </p>
          </div>
        </div>
      </AccordionTrigger>

      <hr className="border border-[#0000001A]" />

      <AccordionContent className="bg-white rounded-b-lg">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3 p-4 pt-0">
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-black">Expertise</p>
            <p className="text-xs font-medium text-[#6D6A5D]">
              {typeof doc?.practiceDetails?.specialization === "string" ? (
                doc.practiceDetails.specialization
                  ?.split(",")
                  ?.map((lang, _lx) => (
                    <span key={_lx}>{lang?.trim() || ""} </span>
                  ))
              ) : (
                <span></span>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-semibold text-black">Gender</p>
            <p className="text-xs font-medium text-black">
              {doc.generalInformation?.gender || ""}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-black">Session Mode</p>
            <p className="text-xs font-medium text-[#6D6A5D]">
              {doc.practiceDetails?.type}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-semibold text-black">Session Fee</p>
            <p className="text-xs font-medium text-[#6D6A5D]">
              {formatAmount(doc?.practiceDetails?.fees?.singleSession)}
            </p>
          </div>
        </div>

        <hr className="border border-[#0000001A]" />

        <div className="px-4 mt-4">
          <Button
            onClick={() => {
              handleBookNowClick()
            }}
            className="w-full h-[45px] bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] py-[14.5px] text-[15px] font-semibold rounded-[8px]"
          >
            Book Now
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DoctorCard;