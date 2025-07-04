"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Patient_Header from "./Patient_Header/Patient_Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { whatsappUrl } from "@/lib/constants";

const Verified_Successfully = ({ type }) => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push(`/patient/${type}/create/password`);
    }, 1000);
  }, [type]);
  return (
    <>
      <div className=" bg-gradient-to-b  from-[#DFDAFB] to-[#F9CCC5] h-full flex flex-col px-3">
        <div className="hidden">
          <Patient_Header />
        </div>
        <div className="h-full flex flex-col justify-around items-center">
          <div className="flex flex-col items-center w-full mt-[70px]">
            <div className="flex flex-col items-center gap-[11px]">
              <strong className="text-[16px] text-black font-[600] text-center">
                Verified successfully
              </strong>
              <Image
                src="/images/Verified-successfully.png"
                width={62}
                height={62}
                className="w-[62.5px]"
                alt="ekyamm"
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-col justify-center items-center gap-[4.75px] pb-5">
          <div
            className="flex gap-1 items-center
          "
          >
            <span className="text-[10px] text-gray-500 font-medium">
              Copyright © {new Date().getFullYear()}
            </span>
            <Image
              src="/images/ekyamm.png"
              width={100}
              height={49}
              className="w-[106px] mix-blend-multiply"
              alt="ekyamm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 font-medium">
              Any technical support
            </span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/chat_icon.png"
                width={54}
                height={49}
                className="w-[54px]"
                alt="ekyamm"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verified_Successfully;
