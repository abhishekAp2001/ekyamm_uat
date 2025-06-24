"use client";

import Image from "next/image";
import { useState } from "react";
import SignOutModal from "../SignOutModal/SignOutModal"; // adjust path as needed
import { useRouter } from "next/navigation";

const Sidebar = ({ onClose }) => {
  const router = useRouter();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
  };

  const handleConfirmSignOut = () => {
    // Add actual sign-out logic here
    console.log("Signed out");
    setShowSignOutModal(false);
    router.push(`/patient/login`);
  };

  return (
    <div className="fixed inset-0 z-50 flex max-w-[576px] mx-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="relative z-50 w-[202px] h-full bg-gradient-to-b from-[#B0A4F5] to-[#EDA197] p-[26px_20px] flex flex-col justify-between">
        <div className="flex flex-col gap-[24px]">
          {/* Close Button */}
          <div
            className="w-[24px] h-[24px] flex items-center justify-end pr-[2px] cursor-pointer relative "
            onClick={onClose}
          >
            <Image
              src="/images/Groups.png"
              alt="Close"
              width={18}
              height={15}
            />
          </div>

          {/* Menu Items */}
          <div className="h-auto w-[162px] flex flex-col gap-[24px]">
            {/* Dashboard */}
            <div className="flex flex-col gap-[8px]">
              <div className="w-[162px] flex items-center gap-2">
                <Image
                  src="/images/Home.png"
                  alt="Dashboard Icon"
                  width={24}
                  height={24}
                />
                <p className="text-[14px] font-[600] font-[Quicksand] text-white">
                  Dashboard
                </p>
              </div>
              <div className=" mt-2 w-[162px] border-t border-white opacity-50 "></div>
            </div>

            {/* Clinic Details */}
            <div className="flex flex-col gap-[8px]">
              <div className="w-[162px] flex items-center gap-2">
                <Image
                  src="/images/clinic 1.png"
                  alt="Clinic Icon"
                  width={24}
                  height={24}
                />
                <p className="text-[14px] font-[600] font-[Quicksand] text-white">
                  Clinic Details
                </p>
              </div>
              <div className=" mt-2 w-[162px] border-t border-white opacity-50"></div>
            </div>

            {/* Settings + Sign Out */}
            <div className="w-auto h-[74px] flex flex-col gap-[26px]">
              <div className="w-[162px] flex items-center gap-2">
                <Image
                  src="/images/setting.png"
                  alt="Settings Icon"
                  width={24}
                  height={24}
                />
                <p className="text-[14px] font-[600] font-[Quicksand] text-white">
                  Settings
                </p>
              </div>

              <div
                className="w-[162px] flex items-center gap-2 cursor-pointer"
                onClick={handleSignOutClick}
              >
                <Image
                  src="/images/Signout.png"
                  alt="Sign Out Icon"
                  width={24}
                  height={24}
                />
                <p className="text-[14px] font-[600] font-[Quicksand] text-white">
                  Sign Out
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-[164px] flex flex-col items-center gap-[8px]">
          <Image
            src="/images/logo 23.png"
            alt="Support Icon"
            width={167}
            height={36}
            className="rounded-[12.96px]"
          />
          <div className="flex items-center gap-[8px] mt-1">
            <p className="text-[12px] text-black opacity-50 text-center">
              Support
            </p>
            <div className="flex items-center gap-[4px] px-2 py-1 rounded-[6px] bg-[#0000000D]">
              <Image
                src="/images/headphones.png"
                alt="chat"
                width={13}
                height={12}
              />
              <span className="text-[14px] font-[600] text-black">Chat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <SignOutModal
          onCancel={handleCancelSignOut}
          onConfirm={handleConfirmSignOut}
        />
      )}
    </div>
  );
};

export default Sidebar;
