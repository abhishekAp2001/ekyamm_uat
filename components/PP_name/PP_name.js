"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PP_name = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6ff]">
      <div className="w-[705px] bg-white shadow-lg overflow-hidden border border-[#e4dffd]">
        {/* Top Image with rounded bottom corners */}
        <div className="w-full h-[250px] relative overflow-hidden">
          <div className="w-full h-[150px] relative overflow-hidden rounded-bl-[70px] rounded-br-[70px]">
            <Image
              src="/images/name.jpg"
              alt="Top banner"
              fill
              className="object-cover rounded-bl-[70px] rounded-br-[70px]"
            />
          </div>
        </div>

        {/* Clinic Logo + Name */}
        <div className="flex items-center gap-3 px-6 mb-4 mt-[-70px]">
          <Image
            src="/images/Group.png"
            alt="Clinic Logo"
            width={173}
            height={72}
          />
        </div>

        {/* Email Body Content */}
        <div className="px-6 text-[#333] text-[14px] leading-[22px] pb-8">
          <p className="mb-4 font-quicksand text-[15px] text-[#3D3660]">
            <span className="font-semibold text-[20px] text-[#3D3660]">
              Dear [Patient Name],
            </span>
            <br />
            <span className="text-[20px] font-[500] text-[#3D3660] leading-[32px]">
              Welcome to Ekyamm - Clinic Companion! Your trusted partner to
              store your clinic & patient data in your control, just like a bank
              locker.
            </span>
          </p>

          <p className="font-semibold mb-2 text-[20px] text-[#333]">
            To get started, please follow these simple steps:
          </p>

          <ol className="list-decimal list-inside mb-4 space-y-2 font-quicksand text-[20px] text-[#333] leading-[32px]">
            <li>
              Download the Ekyamm App: You can download the Ekyamm app from your
              device’s app store. It’s available for both iOS and Android.
            </li>
            <li>
              Register with Your Email: During the registration process, please
              use the same email address that you received this welcome email
              at.
            </li>
          </ol>

          <p className="mb-4 font-quicksand text-[20px] text-[#333] leading-[32px]">
            At Ekyamm, we take data security and privacy very seriously. Rest
            assured that your data is authorized, private, secure, and
            confidential. We employ the highest standards of encryption and
            security to ensure your patient information is protected at all
            times.
          </p>

          <span className="text-[20px] text-[#3D3660] leading-[32px]">
            Thank you for choosing Ekyamm. We’re here to support your clinic’s
            success. Should you have any questions, concerns, or need
            assistance, simply click on the chat icon in the menu from your app.
          </span>

          {/* Signature */}
          <div className="mt-10 mb-10 font-quicksand text-[20px] text-[#333] leading-[32px]">
            <div className="mb-3">Best regards,</div>
            <div>[Your Name]</div>
            <div>Ekyamm - Clinic Companion Team</div>
          </div>

          {/* Register Button */}
          <div className="mt-8  mb-6 flex justify-center w-full">
            <Link href={'/patient-registration/patient-details'} className="w-full">
            <button
              className="w-full h-[38px] rounded-[8px] border border-[#BBA3E4] bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white font-semibold text-[14px]"
              type="button"
            >
              Register
            </button>
            </Link>
          </div>
          <div className="w-[212px] h-[2px]"></div>
        <div className="flex justify-between items-center">
          <Image
            src="/images/Group 739.png"
            alt="Ekyamm Logo"
            width={214}
            height={78}
          />
            <div className="flex items-center gap-1 mt-10">
              <span className="text-[10px] font-medium whitespace-nowrap">
                Copyright © 2025
              </span>
              <Image
                src="/images/ekyamm.png"
                alt="Ekyamm Logo"
                width={100}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PP_name;
