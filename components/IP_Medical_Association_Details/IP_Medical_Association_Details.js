"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import IP_Header from "../IP_Header/IP_Header";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";


const IP_Medical_Association_Details = () => {
  const [formData, setFormData] = useState({
    name: "",
    medicalAssociationNumber: "",
    certificates: [], // Store { name, base64, url } for each certificate
  });
  const router = useRouter()
  const [touched, setTouched] = useState({
    name: false,
    medicalAssociationNumber: false,
    certificates: false,
  });
  const [drawerOpen,setDrawerOpen] = useState(false)

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Validation functions
  const isNameValid = () => formData.name.trim().length > 0;
  const isMedicalAssociationNumberValid = () => formData.medicalAssociationNumber.trim().length > 0;
  const isCertificatesValid = () => formData.certificates.length > 0;
  const isFormValid = () => isNameValid() && isMedicalAssociationNumberValid() && isCertificatesValid();

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("ip_medical_association_details");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData({
          name: parsedData.name || "",
          medicalAssociationNumber: parsedData.medicalAssociationNumber || "",
          certificates: parsedData.certificates.map(cert => ({
            name: cert.name,
            base64: cert.base64,
            url: cert.base64, // Use base64 as URL for display
          })),
        });
        setTouched({
          name: !!parsedData.name,
          medicalAssociationNumber: !!parsedData.medicalAssociationNumber,
          certificates: parsedData.certificates.length > 0,
        });
      } catch (error) {
        console.error("Error parsing ip_medical_association_details:", error);
      }
    }

    // Cleanup: Revoke blob URLs on unmount
    return () => {
      formData.certificates.forEach((certificate) => {
        if (certificate.url && certificate.url.startsWith("blob:")) {
          URL.revokeObjectURL(certificate.url);
        }
      });
    };
  }, []);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle text input changes
  const handleTextInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle blur for validation
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle file upload for certificates
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        const fileUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          certificates: [...prev.certificates, { name: file.name, base64, url: fileUrl }],
        }));
        setTouched((prev) => ({ ...prev, certificates: true }));
        handleCloseDrawer()
      } catch (error) {
        console.error("Error converting file to base64:", error);
        showErrorToast("Failed to upload certificate");
      }
    }
  };

  // Handle certificate deletion
  const handleCertificateDelete = (index) => {
    setFormData((prev) => {
      const updatedCertificates = [...prev.certificates];
      if (updatedCertificates[index].url && updatedCertificates[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(updatedCertificates[index].url);
      }
      updatedCertificates.splice(index, 1);
      return { ...prev, certificates: updatedCertificates };
    });
    setTouched((prev) => ({ ...prev, certificates: true }));
  };

  // Trigger specific file input
  const handleFileInputTrigger = (type) => {
    if (type === "camera" && cameraInputRef.current) {
      cameraInputRef.current.click();
    } else if (type === "gallery" && galleryInputRef.current) {
      galleryInputRef.current.click();
    } else if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle save (store all data in localStorage and upload to AWS)
  const handleSave = async () => {
    setTouched({
      name: true,
      medicalAssociationNumber: true,
      certificates: true,
    });
    if (isFormValid()) {
      try {
        // Store all form data in localStorage
        const saveData = {
          name: formData.name,
          medicalAssociationNumber: formData.medicalAssociationNumber,
          certificates: formData.certificates.map(({ name, base64 }) => ({ name, base64 })),
        };
        localStorage.setItem("ip_medical_association_details", JSON.stringify(saveData));
        router.push("/sales/ip_medical_association_certificate")
      } catch (error) {
        console.error("Error saving data:", error);
        showErrorToast("Failed to save details");
      }
    } else {
      showErrorToast("Please fill all required fields and upload at least one certificate");
    }
  };
  
  const handleCloseDrawer = () =>{
    setDrawerOpen(false)
  }

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px] mx-auto ">
      <IP_Header text="Medical Association Details" />
      <div className="h-full mb-[26%] overflow-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb]">
        <div>
          <Label htmlFor="name" className="text-[15px] text-gray-500 mb-[7.59px]">
            Name of Medical Association *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter Name of Medical Association"
            value={formData.name}
            onChange={(e) => handleTextInputChange(e, "name")}
            onBlur={() => handleBlur("name")}
            className="bg-white rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] placeholder:text-gray-500 py-3 px-4 h-[39px]"
          />
          {touched.name && !isNameValid() && (
            <span className="text-red-500 text-sm mt-1 block">
              Medical Association Name is required
            </span>
          )}
        </div>
        <div>
          <Label
            htmlFor="medicalAssociationNumber"
            className={`text-[15px] mb-[7.59px] mt-4 ${isNameValid() ? "text-gray-500" : "text-[#00000040]"}`}
          >
            Medical Association Number *
          </Label>
          <Input
            id="medicalAssociationNumber"
            type="text"
            placeholder="Enter Medical Association Number"
            value={formData.medicalAssociationNumber}
            onChange={(e) => handleTextInputChange(e, "medicalAssociationNumber")}
            onBlur={() => handleBlur("medicalAssociationNumber")}
            disabled={!isNameValid()}
            className={`rounded-[7.26px] text-[15px] text-black font-semibold placeholder:text-[15px] py-3 px-4 h-[39px] ${
              isNameValid()
                ? "bg-white placeholder:text-gray-500"
                : "bg-[#ffffff10] placeholder:text-[#00000040]"
            }`}
          />
          {touched.medicalAssociationNumber && !isMedicalAssociationNumberValid() && (
            <span className="text-red-500 text-sm mt-1 block">
              Medical Association Number is required
            </span>
          )}
        </div>
        <div className="mt-[21px] bg-[#FFFFFF80] rounded-[12px] p-4 h-[184px]">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-gray-800">
              Upload Certificate *
            </span>
            <div className="">
            <Drawer open={drawerOpen} onClose={handleCloseDrawer} >
              <DrawerTrigger>
                <Button
                  className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center w-[87px] h-[32px]"
                  disabled={!isMedicalAssociationNumberValid()}
                  onClick={()=>setDrawerOpen(true)}
                >
                  + Add
                </Button>
              </DrawerTrigger>
              <DrawerTitle></DrawerTitle>
              <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] bottom-drawer">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col gap-3">
                    {isMobile && (
                      <Button
                        className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px]"
                        onClick={() => handleFileInputTrigger("camera")}
                      >
                        Take Photo
                        <Image
                          src="/images/arrow.png"
                          width={24}
                          height={24}
                          className="w-[24px]"
                          alt="arrow"
                        />
                      </Button>
                    )}
                    <Button
                      className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px]"
                      onClick={() => handleFileInputTrigger("gallery")}
                    >
                      Choose from Gallery
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="arrow"
                      />
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex justify-between items-center w-full h-[50px]"
                      onClick={() => handleFileInputTrigger("file")}
                    >
                      Upload from File
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="arrow"
                      />
                    </Button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="p-0"></DrawerFooter>
              </DrawerContent>
            </Drawer>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 overflow-x-auto">
            {formData.certificates.map((certificate, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center w-[84px] h-[105px] rounded-[9px] border-[0.93px] bg-[#000000]"
              >
                <Button
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center p-0"
                  onClick={() => handleCertificateDelete(index)}
                >
                  ✕
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="bg-transparent flex justify-center items-center w-full h-full"
                    >
                      <Image
                        src={certificate.base64 || certificate.url}
                        width={84}
                        height={105}
                        className="w-full h-full object-cover rounded-[9px]"
                        alt={`Certificate ${index + 1}`}
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-[65vh] bg-[#0000009c] text-white flex justify-center items-center">
                    <Image
                      src={certificate.base64 || certificate.url}
                      width={300}
                      height={400}
                      className="max-w-full max-h-full object-contain"
                      alt={`Certificate ${index + 1} Preview`}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
            {touched.certificates && !isCertificatesValid() && (
              <span className="text-red-500 text-sm mt-1 block">
                At least one certificate is required
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] flex justify-center items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-[16px] max-w-[576px] mx-auto">
        <Button
          className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] rounded-[8px] flex items-center justify-center w-full h-[45px]"
          onClick={handleSave}
          disabled={!isFormValid()}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default IP_Medical_Association_Details;
