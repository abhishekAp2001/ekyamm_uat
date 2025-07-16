import React, { useEffect, useState } from "react";
import { MapPin, Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { greeting } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useRouter } from "next/navigation";

/**
 * Header component displays hospital info, greeting, user avatar and name.
 * Accepts loading and data props for skeleton/loading state.
 * data should have firstName and lastName fields.
 */
const Header = ({ loading = false, patient }) => {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    firstName = "",
    lastName = "",
    clinicName = "",
    addressDetails = null,
  } = patient || {};
  // determine greeting based on current time

  return (
    <div className="bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] rounded-bl-3xl rounded-br-3xl px-3 py-5 h-[128px]">
      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[18px] text-white font-semibold">{patient?.clinicDetails?.clinicName}</h1>
          <div className="flex items-center gap-[2px]">
            <div className="bg-[#FFFFFF80] rounded-full w-[12px] h-[12px] flex items-center justify-center">
              <MapPin className="w-2 h-2 text-[#9f99bebd]" />
            </div>
            <span className="text-xs text-[#FFFFFF80] font-medium">
              {addressDetails?.area}
            </span>
          </div>
        </div>

        {showSidebar && (
          <div className="absolute inset-0 z-50">
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        )}

        <div className="flex justify-between items-center mt-2 relative">
          <div className="flex items-center gap-2">
            <Avatar className='w-8 h-4 rounded-[25px] contents'
            onClick={() => router.push("/patient/patient-profile")}>
              <AvatarImage
                className="h-8 w-8 mix-blend-multiply rounded-[25px] pt-0 overflow-auto"
                src={patient?.profileImageUrl ||"/images/profile.png"}
                alt={`${patient?.firstName} ${patient?.lastName}`}
              />
            </Avatar>
            {/* <Image
              src="/images/user.png"
              width={34}
              height={34}
              className="h-[34px] w-[34px] pt-1.5 mix-blend-multiply"
              alt="User"
            /> */}
            <div className="flex flex-col">
              {/* greeting */}
              <span className="text-sm text-white">Good {greeting},</span>

              {/* show skeleton when loading, else show full name from data */}
              {loading ? (
                <Skeleton className="h-5 w-24 rounded-md bg-white/50" />
              ) : (
                <strong className="text-lg text-white">
                  {firstName} {lastName}
                </strong>
              )}
            </div>
          </div>

          <Menu
            color="white"
            className="w-5 h-5"
            onClick={() => setShowSidebar(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
