"use client";
import React from "react";
import Image from "next/image";
import { ChevronLeft, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const certificationList = [
  {
    degree: "M.D",
    specialization: "Psychology",
    passingYear: "2001",
    college: "AIIPMR Mumbai",
    university: "Mumbai University",
    city: "Mumbai",
    state: "Maharashtra",
    certificates: [
      "/images/photo.png",
      "/images/photo.png",
      "/images/photo.png",
    ],
  },
  {
    degree: "M.D",
    specialization: "Psychology",
    passingYear: "2001",
    college: "AIIPMR Mumbai",
    university: "Mumbai University",
    city: "Mumbai",
    state: "Maharashtra",
    certificates: [
      "/images/photo.png",
      "/images/photo.png",
      "/images/photo.png",
    ],
  },
];

const Certifications = ({ setShowCertifications, doc }) => {
  return (
    <div className="min-h-screen w-full px-4 pt-2 pb-6 max-w-[576px] mx-auto" style={{ background: `linear-gradient(rgb(223, 218, 251) 0%, rgb(249, 204, 197) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))`}}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 fixed top-0 left-0 right-0 px-4 bg-[#] max-w-[576px] mx-auto">
        <div className="py-4 flex items-center gap-2">
          <ChevronLeft
            className="w-5 h-5 text-black cursor-pointer"
            onClick={() => {
              setShowCertifications(false);
            }}
          />
          <h1 className="text-[16px] font-semibold">Certifications</h1>
        </div>
      </div>

      {/* Certification Cards */}
      <div className="flex flex-col gap-6 pt-[15%] lg:pt-[10%]">
        {doc?.practiceDetails?.medicalAssociations && doc.practiceDetails?.medicalAssociations.length > 0 ? (
          doc?.practiceDetails?.medicalAssociations?.map((item, index) => (
          <div
            key={index}
            className="bg-[#FFFFFF80] rounded-[12px]  px-[35px] py-7 flex flex-col gap-2"
          >
            <p className="text-sm font-medium">
              Medical Associations: 
              <strong className="text-sm font-medium">{item?.name}</strong>
            </p>
            <p className="text-sm font-medium">
              <strong className="text-sm font-medium">Medical Associations Number:</strong>{" "}
              {item?.medicalAssociationNumber}
            </p>
            <p className="text-sm font-medium">
              <strong className="text-sm font-medium">Certificates:</strong>
            </p>
            <div className="flex gap-3 mt-2">
              {item.certificates.map((img, i) => (
                <Dialog key={i} className="h-[80vh]">
                  <DialogTrigger asChild>
                    <div className="relative group w-[84px] h-[105px] rounded-[9px] overflow-hidden cursor-pointer">
                      <Image
                        src={img}
                        alt="certificate"
                        fill
                        className="object-cover"
                      />
                      {/* Black overlay with zoom icon */}
                      <div className="absolute inset-0 bg-[#000000b3] transition-opacity duration-200 flex items-center justify-center">
                        <Image
                          src="/images/preview.png"
                          alt="preview"
                          width={20}
                          height={20} className="object-cover"
                        />
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="w-full h-[80vh] p-0 bg-transparent border-none z-90">
                    {/* Cancel button */}
                    <div className="absolute top-2 right-2">
                      <DialogClose asChild>
                        {/* <button className="">
                          <span className="text-white text-xl border-0">
                            <X />
                          </span>
                        </button> */}
                      </DialogClose>
                    </div>

                    <div className="w-full h-full flex items-center justify-center p-4 bg-[#000000b3] rounded-[7px]">
                      <Image
                        src={img}
                        alt="Zoomed certificate"
                        width={600}
                        height={800}
                        className="rounded-lg object-contain max-h-[80vh] w-auto"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        ))
        ):(
          <div className="text-center text-gray-500 py-8">
              No certifications available.
            </div>
        )}
      </div>
    </div>
  );
};

export default Certifications;
