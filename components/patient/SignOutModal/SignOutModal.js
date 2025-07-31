"use client";

import React from "react";
import { X } from "lucide-react";

const SignOutModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black/30 z-50 max-w-[576px] mx-auto"
    onClick={onCancel}>
      <div className="w-full h-[194px] rounded-t-[16px] bg-gradient-to-b from-[#F9F8FD] to-[#FDF1F0] shadow-xl p-6 relative flex flex-col justify-between rounded-tl-2xl rounded-tr-2xl"
      onClick={e => e.stopPropagation()}>
        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-black hover:text-gray-600 transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Message */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-[Quicksand] font-bold text-[20px] leading-[100%] text-black">
            Are you sure
          </p>
          <p className="font-[Quicksand] font-bold text-[20px] leading-[100%] text-black mt-1">
            you want to sign out?
          </p>
        </div>

        {/* Buttons */}
      <div className="w-full h-[40.51px] flex justify-center gap-[12px] mx-auto mb-[26px]">
  <button
    onClick={onCancel}
    className="w-full h-[40.51px] border border-[#CC627B] text-[#CC627B] rounded-[8px] text-[14px] font-[600] font-[Quicksand] leading-[16px] flex items-center justify-center mr-auto"
  >
    Cancel
  </button>

  <button
    onClick={onConfirm}
    className="w-full h-[40.51px] bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] text-white rounded-[8px] text-[14px] font-[600] font-[Quicksand] leading-[16px] flex items-center justify-center ml-auto"
  >
    Sign out
  </button>
</div>


      </div>
    </div>
  );
};

export default SignOutModal;
