"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import IP_Header from "../IP_Header/IP_Header";
import { toast } from "react-toastify";
import { DrawerTitle } from "../ui/drawer";
import { showErrorToast } from "@/lib/toast";

const IP_Medical_Association_Certificate = () => {
  const [formData, setFormData] = useState({
    name: "",
    medicalAssociationNumber: "",
    certificates: [],
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("ip_medical_association_details");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData({
          name: parsedData.name || "",
          medicalAssociationNumber: parsedData.medicalAssociationNumber || "",
          certificates:
            parsedData.certificates.map((cert) => ({
              name: cert.name,
              base64: cert.base64,
            })) || [],
        });
      } catch (error) {
        console.error(
          "Error parsing ip_medical_association_details from localStorage:",
          error
        );
        showErrorToast("Failed to load medical association details");
      }
    }
  }, []);

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px] mx-auto">
      <IP_Header text="Medical Association Details" />
      <div className="h-full mb-[26%] overflow-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
        {/* Practitioner details */}
        <div className="h-auto bg-[#FFFFFF80] rounded-[12px] py-4 px-[19px]">
          <div className="flex flex-col gap-2 justify-start relative">
            <strong className="text-[15px] font-[700] text-black h-[16px]">
              Name of the Medical Association
            </strong>
            <span className="text-[15px] font-[500] text-gray-600">
              {formData.name || "Not provided"}
            </span>
            <strong className="text-[15px] font-[700] text-black mt-2">
              Certificate Number
            </strong>
            <span className="text-[15px] font-[500] text-gray-600">
              {formData.medicalAssociationNumber || "Not provided"}
            </span>
          </div>
          <div className="flex flex-col mt-4 gap-2">
            <span className="text-[15px] font-[500] text-black">
              Certificates:
            </span>
            {formData.certificates.length > 0 ? (
              <div className="flex items-center gap-2 overflow-x-auto">
                {formData.certificates.map((certificate, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-center w-[84px] h-[105px] rounded-[9px] border-[0.93px] bg-[#000000]"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="bg-transparent flex justify-center items-center w-full h-full"
                        >
                          <Image
                            src={certificate.base64}
                            width={84}
                            height={105}
                            className="w-full h-full object-cover rounded-[9px]"
                            alt={`Certificate ${index + 1}`}
                          />
                        </Button>
                      </DialogTrigger>
                      <DrawerTitle></DrawerTitle>
                      <DialogContent className="h-[65vh] bg-[#0000009c] text-white flex justify-center items-center">
                        <Image
                          src={certificate.base64}
                          width={300}
                          height={400}
                          className="max-w-full max-h-full object-contain"
                          alt={`Certificate ${index + 1} Preview`}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[15px] font-[500] text-gray-600">
                No certificates available
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] flex justify-center items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-[16px] max-w-[576px] mx-auto">
         <Link href="/sales/ip_single_session_fees" className="w-full">
        <Button className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center w-full h-[45px]">
         Continue
        </Button></Link>
      </div>
    </div>
  );
};

export default IP_Medical_Association_Certificate;
