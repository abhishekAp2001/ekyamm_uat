"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import PP_Header from "../PP_Header/PP_Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Profile from "../practitioner/Profile";
import Client_Testimonial from "../Client_Testimonials/Client_Testimonial";
import Certifications from "../Certifications/Certifications";
import axios from "axios";
import { patientSessionToken as getPatientSessionToken } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Baseurl, whatsappUrl } from "@/lib/constants";
import { setCookie } from "cookies-next";
import { base64ToFile } from "@/lib/utils";
import { useRememberMe } from "@/app/context/RememberMeContext";
const sessionData = [
  {
    date: "24th Apr",
    time: "12:00 AM",
    doctor: "Dr. Ramesh Naik",
    previous: "Tuesday, March 25, 2023",
  },
  {
    date: "14th Apr",
    time: "10:30 AM",
    doctor: "Dr. Suresh Sawant",
    previous: "Tuesday, March 15, 2023",
  },
  {
    date: "2nd Apr",
    time: "09:30 AM",
    doctor: "Dr. Neeta Singh",
    previous: "Tuesday, Feb 25, 2023",
  },
];

const Patient_Profile = () => {
  const {rememberMe} = useRememberMe()
  const router = useRouter();
  const cookieValue = getCookie("PatientInfo");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const patient = cookieValue ? JSON.parse(cookieValue) : {};
  const [activeIndex, setActiveIndex] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile1] = useState("");
  const [email, setEmail] = useState("")
  const [showCounsellorProfile, setShowCounsellorProfile] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showClientTestimonials, setShowClientTestimonials] = useState(false);
  const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [otp, setOtp] = useState("")
  const [verifiedDrawerOpen, setVerifiedDrawerOpen] = useState(false)
  const [newMobileDrawer, setNewMobileDrawer] = useState(false)
  const [newOtpSent, setNewOtpSent] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [newVerifiedDrawer, setNewVerifiedDrawer] = useState(false)
  const [drawerFor, setDrawerFor] = useState("mobile")
  const [imageDrawer, setImageDrawer] = useState(false)
  const [openTooltipIndex, setOpenTooltipIndex] = useState(null);
  const [formData, setFormData] = useState({
    profileImageBase64: "",
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    countryCode_primary: patient?.countryCode_primary || "🇮🇳 +91",
    primaryMobileNumber: patient?.primaryMobileNumber || "",
    email: patient?.email || "",
    countryCode_whatsapp: patient?.countryCode_whatsapp || "🇮🇳 +91",
    whatsappNumber: patient?.whatsappNumber || "",
    gender: patient?.gender || "",
    addressDetails: {
      pincode: patient?.addressDetails?.pincode || "",
      area: patient?.addressDetails?.area || "",
      city: patient?.addressDetails?.city || "",
      state: patient?.addressDetails?.state || "",
    },
  });
  useEffect(() => {
    if (!cookieValue) {
      router.push('/patient/login')
    }
  })
  const cameraInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const handleInputChange = (e, setMobile, setEmail) => {
    console.log("here")
    if (drawerFor == "email") {
      setEmail(e.target.value)
    }
    else {
      const digitsOnly = e.target.value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setMobile(digitsOnly);
      }
    }
  };

  const toggleSection = (idx) => {
    setActiveIndex((prev) => {
      const newIndex = prev === idx ? null : idx;
      setTimeout(() => {
        const section = document.getElementById(`scrollable-section-${idx}`);
        if (section) {
          section.scrollTop = 0;
        }
      }, 100);
      return newIndex;
    });
  };

  const handleRouting = (route) => {
    if (route) {
      router.push(route);
    }
  }
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = getPatientSessionToken();
    setPatientSessionToken(token);
  }, []);

  useEffect(() => {
    if (!patientSessionToken) return;
    const getTherapistDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient?type=therapist`, {
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          setTherapist(response?.data?.data.practitionerTagged[0]);
        }
      } catch (err) {
        console.error("err", err);
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      } finally {
        setLoading(false);
      }
    };
    getTherapistDetails();
  }, [patientSessionToken]);
  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleChoosePhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, profileImageBase64: base64 }));
        setDrawerOpen(false);
        // Pass the new base64 directly
        handleUpdatePatientDetails({ ...formData, profileImageBase64: base64 });
      } catch (error) {
        showErrorToast("Failed to upload profile image");
      }
    }
  };

  // Handle photo deletion
  const handlePhotoDelete = () => {
    const updatedFormData = { ...formData, profileImageBase64: "", profileImageUrl: "" };
    setFormData(updatedFormData);
    setDrawerOpen(false);
    handleUpdatePatientDetails(updatedFormData); // Pass the updated object
  };

  const handleUpdatePatientDetails = async (overrideFormData) => {
    setIsLoading(true);
    try {
      const data = overrideFormData || formData;
      let updatedFormData = { ...data };
      if (data?.profileImageBase64) {
        const imageUrl =
          (await uploadImage(data?.profileImageBase64, "profile")) || "";
        updatedFormData.profileImageUrl = imageUrl;
      }
      const { profileImageBase64, ...payload } = updatedFormData;
      const response = await axios.put(
        process.env.NEXT_PUBLIC_BASE_URL + `/v2/cp/patient/update`,
        { patientDetails: payload },
        { headers: { accesstoken: patientSessionToken } }
      );
      if (response?.data?.success) {
        let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
        setCookie("PatientInfo", JSON.stringify(response?.data?.data),maxAge);
        setImageDrawer(false)
        router.push(`/patient/patient-profile`);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (filename, type) => {
    try {
      console.log("filename",filename)
      const file = await base64ToFile(filename, 0.6);
      console.log("File",file)
      const form = new FormData();
      form.append("filename", file);
      console.log("PAYLOAD",form)
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + `/v2/psychiatrist/uploadImage`,
        form,
        {
          headers: {
            accesstoken: patientSessionToken,
          },
        }
      );
      if (response?.data?.success) {
        const imageUrl = response?.data?.image;
        return imageUrl;
      }
    } catch (error) {
      console.error("error", error)
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(error?.response?.data?.error?.message);
      }
      return null;
    }
  };
  const sendOtpMObile = async (mobile = "") => {
    setDrawerOpen(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/otpGenerateForProfile`, {
        newMobile: mobile
      }, {
        headers: {
          accesstoken: patientSessionToken,
        },
      })
      if (response?.data?.success) {
        showSuccessToast("OTP sent to registered mobile number")
      }
      if (!response?.data?.success) {
        showErrorToast("Unable to send OTP")
        setDrawerOpen(false)
      }
    } catch (error) {
      showErrorToast("Unable to send OTP")
      console.error("Error", error)
    }
  }
  const verifyMobileOtp = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/otpValidateForProfile`, {
        otp: otp
      }, {
        headers: {
          accesstoken: patientSessionToken,
        }
      })
      setIsLoading(false)
      if (response?.data?.success) {
        showSuccessToast("OTP Verified succesfully")
        setVerifiedDrawerOpen(true)
        setOtp("")
      }
      if (!response?.data?.success) {
        showErrorToast("Invalid OTP")
      }
    } catch (error) {
      showErrorToast("Invalid OTP")
      setIsLoading(false)
      console.error("Error", error)
    }
  }
  const handleVerifiedDrawerClose = () => {
    setVerifiedDrawerOpen(false)
    setDrawerOpen(false)
    setOtpSent(false)
    setOtp("")
    setNewMobileDrawer(false)
    setNewOtpSent(false)
    setNewVerifiedDrawer(false)
    setDrawerFor("mobile")
    setEmail("")
    setMobile1("")
  }
  const sendNewOtp = async (mobile) => {
    try {
      if (mobile.length != 10) {
        showErrorToast("Enter a valid mobile number")
        return
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/otpGenerateForProfile`, {
        newMobile: mobile
      }, {
        headers: {
          accesstoken: patientSessionToken,
        },
      })
      if (response?.data?.success) {
        setNewOtpSent(true)
        setSecondsLeft(120)
        showSuccessToast("OTP sent to new mobile number")
      }
      if (!response?.data?.success) {
        showErrorToast("Unable to send OTP")
        setDrawerOpen(false)
      }
    } catch (error) {
      showErrorToast("Unable to send OTP")
      console.error("Error", error)
    }
  }

  const verifyNewMobileOtp = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/mobile/otpValidateForProfile`, {
        otp: otp,
        newMobile: mobile
      }, {
        headers: {
          accesstoken: patientSessionToken,
        }
      })
      setIsLoading(false)
      if (response?.data?.success) {
        setNewVerifiedDrawer(true)
        setNewMobileDrawer(false)
        showSuccessToast("OTP Verified succesfully")
        setOtp("")
      }
      if (!response?.data?.success) {
        showErrorToast("Invalid OTP")
      }
    } catch (error) {
      showErrorToast("Invalid OTP")
      setIsLoading(false)
      console.error("Error", error)
    }
  }

  const sendOtpEmail = async (email = "") => {
    setDrawerFor("email")
    setDrawerOpen(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/otpGenerateForProfile`, {
        email: email
      }, {
        headers: {
          accesstoken: patientSessionToken,
        },
      })
      if (response?.data?.success) {
        showSuccessToast("OTP sent to registered email")
      }
      if (!response?.data?.success) {
        showErrorToast("Unable to send OTP")
        setDrawerOpen(false)
      }
    } catch (error) {
      showErrorToast("Unable to send OTP")
      console.error("Error", error)
    }
  }

  const verifyEmailOtp = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/otpValidateForProfile`, {
        otp: otp
      }, {
        headers: {
          accesstoken: patientSessionToken,
        }
      })
      setIsLoading(false)
      if (response?.data?.success) {
        showSuccessToast("OTP Verified succesfully")
        setVerifiedDrawerOpen(true)
        setOtp("")
      }
      if (!response?.data?.success) {
        showErrorToast("Invalid OTP")
      }
    } catch (error) {
      showErrorToast("Invalid OTP")
      setIsLoading(false)
      console.error("Error", error)
    }
  }

  const verifyNewEmailOtp = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/otpValidateForProfile`, {
        otp: otp
      }, {
        headers: {
          accesstoken: patientSessionToken,
        }
      })
      setIsLoading(false)
      if (response?.data?.success) {
        setNewMobileDrawer(false)
        setNewVerifiedDrawer(true)
        showSuccessToast("OTP Verified succesfully")
        setOtp("")
      }
      if (!response?.data?.success) {
        showErrorToast("Invalid OTP")
      }
    } catch (error) {
      showErrorToast("Invalid OTP")
      setIsLoading(false)
      console.error("Error", error)
    }
  }

  const sendNewOtpEmail = async (email) => {
    console.log(email)
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showErrorToast("Enter a valid email address");
        return;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/email/otpGenerateForProfile`, {
        email: email
      }, {
        headers: {
          accesstoken: patientSessionToken,
        },
      })
      if (response?.data?.success) {
        setNewOtpSent(true)
        setSecondsLeft(120)
        showSuccessToast("OTP sent to new email")
      }
      if (!response?.data?.success) {
        showErrorToast("Unable to send OTP")
        setDrawerOpen(false)
      }
    } catch (error) {
      showErrorToast("Unable to send OTP")
      console.error("Error", error)
    }
  }
  const updateContactDetails = async (mobile) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient/contactDetails/update`, {
        countryCode_primary: "🇮🇳 +91",
        primaryMobileNumber: mobile
      }, {
        headers: {
          accesstoken: patientSessionToken
        }
      })
      console.log("Res", response)
      if (response?.data?.success) {
        let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
        patient.countryCode_primary = "🇮🇳 +91"
        patient.primaryMobileNumber = mobile
        setCookie("PatientInfo", JSON.stringify(patient),maxAge)
        showSuccessToast("Contact details updated")
        handleVerifiedDrawerClose()
      }
      else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("Error", error);
      if (error.response?.data?.error?.message) {
        showErrorToast(error.response.data.error.message);
      } else {
        showErrorToast("Something went wrong");
      }
    }
    finally {
      handleVerifiedDrawerClose();
      setMobile1("");
    }
  }

  const updateEmailDetails = async (email) => {
    console.log("email", email)
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient/contactDetails/update`, {
        email: email
      }, {
        headers: {
          accesstoken: patientSessionToken
        }
      })
      console.log("Res", response)
      if (response?.data?.success) {
        let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
        patient.email = email
        setCookie("PatientInfo", JSON.stringify(patient),maxAge)
        showSuccessToast("Contact details updated")
        handleVerifiedDrawerClose()
      }
      else {
        showErrorToast(
          response?.data?.error?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("Error", error);
      if (error.response?.data?.error?.message) {
        showErrorToast(error.response.data.error.message);
      } else {
        showErrorToast("Something went wrong");
      }
    }
    finally {
      handleVerifiedDrawerClose();
      setMobile1("");
      setEmail("")
    }
  }
  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router]);

  const formatSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px]">
      <div className="">
        <div className="flex items-center justify-between py-5 ps-3 pe-5">
          {/* Left Icon */}
          <ChevronLeft size={28} className="text-black cursor-pointer"
            onClick={() => { router.push("/patient/dashboard") }} />
          {/* Right Side Image */}
          <Image
            onClick={() => { router.push('/patient/dashboard') }}
            src="/images/box.png"
            width={28}
            height={18}
            alt="right-icon"
            className="bg-transparent"
          />
        </div>
      </div>
      <div className="h-full  overflow-x-hidden overflow-y-auto px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] pb-5 max-w-[576px]">
        {/* Profile Image */}
        {/* Main Card */}
        <div className="bg-[#FFFFFF]  p-6 pb-1 mt-[55px] rounded-[16px]">
          <div className="flex justify-center  rounded-[17.63px] mx-auto relative mb-6 mt-[-77px]">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage
                src={patient?.profileImageUrl || "/images/profile.png"}
                alt={`${patient?.firstName} ${patient?.lastName}`}
                className="rounded-full object-fill"
              />
            </Avatar>
            <Drawer className="pt-[9.97px]" open={imageDrawer} onClose={() => setImageDrawer(false)}>
              <DrawerTrigger className="absolute top-[68%] md:top-[70%] right-[36%] md:right-[41%]">
                <Image
                  src="/images/camera.png"
                  width={31}
                  height={31}
                  className="w-7 h-7"
                  alt="Camera"
                  onClick={() => setImageDrawer(true)}
                />
              </DrawerTrigger>
              <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col gap-3">
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px] rounded-[8.62px]"
                      onClick={handleTakePhoto}
                    >
                     Take Photo
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px] rounded-[8.62px]"
                      onClick={handleChoosePhoto}
                    >
                      <Link href={""}>Choose Photo</Link>
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px] rounded-[8.62px]"
                      onClick={handlePhotoDelete}>
                      <Link href={""}>Delete Photo</Link>
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="p-0"></DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <strong className="flex text-[20px] font-[600] text-black items-center justify-center mb-2">
            {patient?.firstName} {patient?.lastName}
          </strong>

          <div className="flex text-[14px] font-[500] text-gray-500 items-center justify-center">
            +91 {patient?.primaryMobileNumber}
            <div className=""
              onClick={() => { sendOtpMObile() }}>
              <Image
                src="/images/Edit.png"
                width={10}
                height={10}
                alt="edit"
                className="mx-2"
              />
            </div>
          </div>

          <div className="flex text-[14px] font-[500] text-gray-500 items-center justify-center mb-4">
            {patient?.email ? patient.email : "-------"}
            <div
              className={`mx-2 ${!patient?.email ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => { patient?.email && sendOtpEmail() }}
            >
              <Image
                src="/images/Edit.png"
                width={10}
                height={10}
                alt="edit"
                className=""
              />
            </div>

          </div>

          {/* Menu Items */}
          {[
            {
              label: "Sessions",
              icon: "/images/schedule_icon.png",
              bold: true,
              info: true,
              tooltip: "View all your upcoming and past session with your therapist",
              onclick: () => {
                router.push("/patient/upcoming-sessions");
              },
              disabled: false,
            },
            {
              label: "Sessions Synopsis",
              icon: "/images/schedule_icon.png",
              bold: true,
              info: true,
              tooltip:
                "Session Notes shared by your therapists after each session",
              onclick: () => {
                router.push("/patient/sessions-synopsis");
              },
              disabled: false,
            },
            {
              label: "Therapist Details",
              icon: "/images/mindfulness.png",
              bold: true,
              info: true,
              tooltip: "View your therapists profile",
              onclick: () => {
                setShowCounsellorProfile(true);
              },
              disabled: false,
            },
            {
              label: "Call In-Clinic Psychologist",
              icon: "/images/wifi_calling_bar_1.png",
              bold: false,
              info: false,
              tooltip: "",
              disabled: true,
            },
            {
              label: "Clinic Details",
              icon: "/images/medical_services.png",
              bold: true,
              info: true,
              tooltip: "View your Clinic details",
              onclick: () => {
                router.push("/patient/psychiatrist-profile");
              },
              disabled: false,
            },
          ].map((item, idx) => (
            <div key={idx} className="mb-4">
              <button
                className="bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[8px] p-2 h-[56px] w-full text-left flex items-center justify-between"
                style={
                  item.disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}
                }
                onClick={item.onclick}
                disabled={item.disabled}
              >
                <span className="flex items-center text-[14px] font-[600] text-black ml-1">
                  <Image
                    src={item.icon}
                    width={24}
                    height={24}
                    alt="icon"
                    className="mr-2 w-6 h-6"
                  />
                  {item.label}
                  {item.info && (
                    <div className="relative group inline-block">
                      <Image
                        src="/images/group1.png"
                        width={13}
                        height={13}
                        alt="info"
                        className="ml-1 w-[13.6px] h-[13.6px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenTooltipIndex(
                            openTooltipIndex === idx ? null : idx
                          );
                        }}
                      />
                      {item.tooltip && (
                        <strong
                          className={`
                  absolute bottom-full mb-1 left-[-100%] translate-[-44%_0px]
                  px-2 py-1 rounded bg-black text-white text-xs
                  transition whitespace-nowrap z-10
                  ${openTooltipIndex === idx ? 'opacity-100' : 'opacity-0'}
                  group-hover:opacity-100
                `}
                        >
                          {item.tooltip}
                        </strong>
                      )}
                    </div>
                  )}
                </span>
                <Image
                  src="/images/arrow1.png"
                  width={7}
                  height={13}
                  alt="arrow"
                  className="w-[7.47px] h-[13.36px] mr-1"
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-[13px]">
          <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]"
            onClick={() => { router.push('/patient/edit-profile') }}>
            Edit Profile
          </Button>
          <Drawer open={drawerOpen} onClose={() => handleVerifiedDrawerClose()}>
            <DrawerTrigger className="w-full rounded-[8.62px]">
            </DrawerTrigger>

            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] rounded-t-[16px] max-w-[576px] mx-auto bottom-drawer rounded-[8.62px]">
              <DrawerHeader>
                <DrawerDescription className="flex flex-col px-4">
                  {/* Stepper Line */}
                  <div className="flex justify-center items-center mt-[10px] mb-[25px]">
                    <div className="flex items-center w-[324px] h-[11px]">
                      {[0, 1, 2].map((step, idx) => (
                        <React.Fragment key={idx}>
                          {/* Step circle */}
                          <div
                            className={`w-2 h-2 rounded-full border-[3px] ${step === 0 || (otpSent && step <= 1)
                              ? "bg-[#776EA5] border-[#776EA5]"
                              : "bg-gray-300 border-gray-400"
                              }`}
                          ></div>

                          {/* Step line (not after last circle) */}
                          {idx < 2 && (
                            <div
                              className={`flex-1 h-[2px] ${otpSent && step === 0
                                ? "bg-green-500"
                                : "bg-gray-400"
                                }`}
                            ></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* OTP Input UI */}
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-[16px] font-[600] text-black mb-[12px]">
                      Verify Yourself
                    </span>
                    <span className="text-[14px] font-[500] text-black text-center">
                      {drawerFor == "email" ? ("Enter OTP shared on your email") : ("Enter OTP shared on your mobile number")}
                    </span>

                    <div className="mt-[32px]">
                      <InputOTP maxLength={6} className="gap-2"
                        value={otp}          // 👈 controlled value from your state
                        onChange={(value) => setOtp(value)}>
                        <InputOTPGroup className="flex gap-3">
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="rounded-[9.23px] h-[45px] w-[45px] border-[1.54px] border-[#776EA5] text-base text-black"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </DrawerDescription>
              </DrawerHeader>

              <DrawerFooter className="p-4">
                <div className="flex justify-between items-center gap-3 w-full">
                  <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] rounded-[8px] w-[48%] h-[45px]"
                    onClick={() => { handleVerifiedDrawerClose() }}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white rounded-[8px] w-[48%] h-[45px] disabled:opacity-50"
                    onClick={() => { drawerFor == "email" ? verifyEmailOtp() : verifyMobileOtp() }}
                    disabled={otp.length !== 6}  // 👈 corrected this condition too
                  >
                    {isLoading ? (<Loader2 className="animate-spin" />) : (
                      "Verify"
                    )}
                  </Button>

                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* verified successfully */}
        <div className="hidden">
          <div className="flex justify-center pt-[13px]">
            <Drawer open={verifiedDrawerOpen} onClose={() => handleVerifiedDrawerClose()}>
              <DrawerTrigger className="w-full rounded-[8px]">
                <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px] ">
                  Edit Profile
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] h-[330] rounded-[8px]">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col">
                    {/* Stepper Line */}

                    <div className="flex justify-center items-center mt-2 mb-4">
                      <div className="flex items-center w-[324px] h-[11px]">
                        {[0, 1, 2].map((step, idx) => (
                          <React.Fragment key={idx}>
                            {/* Step circle */}
                            <div
                              className={`w-2 h-2 rounded-full border-2 ${step === 0 || (otpSent && step <= 1)
                                ? "bg-green-500 border-green-500"
                                : "bg-gray-300 border-gray-400"
                                }`}
                            ></div>

                            {/* Line only between steps, not after last circle */}
                            {idx < 2 && (
                              <div
                                className={`flex-1 h-[2px] ${otpSent && step === 0
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                                  }`}
                              ></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center mb-[40px] mt-[37px]">
                      <Image
                        src="/images/check_circle.svg"
                        width={75}
                        height={75}
                        alt="arrow"
                        className=" mb-2"
                      />
                      <div className="">
                        <span className="text-[16px] font-[16px] text-black">
                          Verified successfully
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-3 mt-[27.55px] fixed bottom-[57.92px]">
                        <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px] mx-auto rounded-[8px] w-[153.74px] h-[45px]"
                          onClick={() => { handleVerifiedDrawerClose() }}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] mx-auto rounded-[8px] w-[172.27px] h-[45px]"
                          onClick={() => { setOtpSent(true), setNewMobileDrawer(true) }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Enter new mobile Number */}
        <div className="hidden">
          <div className="flex justify-center pt-[13px]">
            <Drawer open={newMobileDrawer} onClose={() => { handleVerifiedDrawerClose() }}>
              <DrawerTrigger className="w-full">
                <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
                  Edit Profile
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] h-[359px]">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col">
                    {/* Stepper Line */}
                    <div className="flex justify-center items-center mt-[15px] mb-5">
                      <div className="flex items-center w-[324px] h-[11px]">
                        {[0, 1, 2].map((step, idx) => (
                          <React.Fragment key={idx}>
                            {/* Step circle */}
                            <div
                              className={`w-2 h-2 rounded-full border-2 ${step === 0 || (otpSent && step <= 1)
                                ? "bg-green-500 border-green-500"
                                : "bg-gray-300 border-gray-400"
                                }`}
                            ></div>

                            {/* Line only between steps, not after last circle */}
                            {idx < 2 && (
                              <div
                                className={`flex-1 h-[2px] ${otpSent && step === 0
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                                  }`}
                              ></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* OTP Section */}
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-[16px] font-[600] text-black mb-[16.49px]">
                        {drawerFor == "email" ? ("Enter New email") : ("Enter New Mobile Number")}
                      </span>

                      <div className="flex items-center bg-white border rounded-[7.26px]  w-[338px] h-[39px]">
                        <Input
                          id="mobile"
                          type="text"
                          placeholder={drawerFor == "email" ? ("Enter email") : ("Enter new mobile number")}
                          value={drawerFor == "email" ? email : mobile}
                          // onChange={handleInputChange}
                          onChange={(e) => handleInputChange(e, setMobile1, setEmail)}
                          className="bg-white border rounded-[7.26px] text-[12px] text-black font-500 placeholder:text-[12px] placeholder:text-[#000000] placeholder:font-[500]  py-3 px-4 w-full h-[39px]"
                          maxLength={drawerFor === "email" ? undefined : 10}
                          inputMode={drawerFor === "email" ? "text" : "numeric"}
                          pattern={drawerFor === "email" ? undefined : "\\d*"}
                        />
                      </div>

                      <div className="mt-[20px] mb-[31.19px]">
                        <div className="flex flex-col justify-center items-center">
                          <span className="text-[12px] font-[500] text-gray-400 pb-1">
                            Enter OTP
                          </span>
                        </div>
                        <div className="mt-[12px]">
                          <InputOTP maxLength={6} className="gap-2"
                            value={otp}          // 👈 controlled value from your state
                            onChange={(value) => setOtp(value)}>
                            <InputOTPGroup className="flex gap-3">
                              {[...Array(6)].map((_, i) => (
                                <InputOTPSlot
                                  key={i}
                                  index={i}
                                  className="rounded-[9.23px] h-[45px] w-[45px] border-[1.54px] border-[#776EA5] text-base text-black"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>

                      <div className="flex justify-between items-start gap-3  fixed bottom-[40px]">
                        <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px]  rounded-[8px] w-[163.34px] h-[45px]"
                          onClick={() => handleVerifiedDrawerClose()}>
                          Cancel
                        </Button>

                        <div className="flex flex-col items-center gap-2">
                          {otp.length === 6 && newOtpSent ? (
                            <Button
                              onClick={() => { drawerFor == "email" ? (verifyNewEmailOtp()) : (verifyNewMobileOtp()) }}
                              disabled={otp.length !== 6}
                              className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white rounded-[8px] w-[163.34px] h-[45px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? <Loader2 className="animate-spin" /> : "Verify"}
                            </Button>
                          ) : !newOtpSent ? (
                            <Button
                              onClick={() => { drawerFor == "email" ? (sendNewOtpEmail(email)) : (sendNewOtp(mobile)) }}
                              className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] rounded-[8px] w-[163.34px] h-[45px]"
                              disabled={
                                drawerFor === "email"
                                  ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                  : mobile.length !== 10
                              }
                            >
                              Get OTP
                            </Button>
                          ) : (
                            <div className="flex flex-col items-center gap-1 min-h-[50px]">
                              <Button
                                onClick={() => { drawerFor == "email" ? (sendNewOtpEmail(email)) : (sendNewOtp(mobile)) }}
                                disabled={secondsLeft > 0}
                                className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] rounded-[8px] w-[163.34px] h-[45px] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Resend OTP
                              </Button>
                              <div className="min-h-[16px] text-[12px] font-[500] text-gray-500">
                                {newOtpSent && secondsLeft > 0 && otp.length < 6 && (
                                  <div className="text-[12px] font-[500] text-gray-500">
                                    Resend OTP in {formatSeconds(secondsLeft)}s
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="hidden">
          <div className="flex justify-center pt-[13px]">
            <Drawer open={newVerifiedDrawer} onClose={() => handleVerifiedDrawerClose()}>
              <DrawerTrigger className="w-full">
                <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
                  Edit Profile
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] h-[330]">
                <DrawerHeader>
                  <DrawerDescription className="flex flex-col">
                    {/* Stepper Line */}

                    <div className="flex justify-center items-center mt-2 mb-4">
                      <div className="flex items-center w-[324px] h-[11px]">
                        {[0, 1, 2].map((step, idx) => (
                          <React.Fragment key={idx}>
                            {/* Step circle */}
                            <div className="w-2 h-2 rounded-full border-2 bg-green-500 border-green-500"></div>

                            {/* Line only between steps, not after last circle */}
                            {idx < 2 && (
                              <div className="flex-1 h-[2px] bg-green-500"></div>
                            )}
                          </React.Fragment>
                        ))}

                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center mb-[40px] mt-[37px]">
                      <Image
                        src="/images/check_circle.svg"
                        width={75}
                        height={75}
                        alt="arrow"
                        className=" mb-2"
                      />
                      <div className="">
                        <span className="text-[16px] font-[16px] text-black">
                          Verified successfully
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-3 mt-[27.55px] fixed bottom-[57.92px]">
                        <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px] mx-auto rounded-[8px] w-[153.74px] h-[45px]"
                          onClick={() => { handleVerifiedDrawerClose(), showErrorToast("Failed to update details") }}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] mx-auto rounded-[8px] w-[172.27px] h-[45px]"
                          onClick={() => {
                            drawerFor == "email" ?
                              updateEmailDetails(email) : updateContactDetails(mobile)
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center ">
        {/* <span className="text-[10px] font-[500] text-black mr-1">Powered by</span> */}
        <Image src="/images/ekyamm.png" width={114} height={24} alt="ekyamm" />
        <div className="flex justify-center items-center mb-[26px]"
          onClick={() => { router.push(`${whatsappUrl}`) }}>
          <span className="text-[12px] font-[500] text-gray-500 mr-1">
            Support
          </span>
          <Image
            src="/images/chat_icon.png"
            width={67}
            height={26}
            alt="chat"
            className="mt-1"
          />
        </div>
      </div>
      {showCounsellorProfile ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90 max-w-[576px] mx-auto" >
          <div className="relative h-screen overflow-y-auto">
            <Profile
              patient={patient}
              setShowCounsellorProfile={setShowCounsellorProfile}
              setShowCertifications={setShowCertifications}
              setShowClientTestimonials={setShowClientTestimonials}
              doc={therapist}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {showCertifications ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Certifications
              setShowCertifications={setShowCertifications}
              doc={patient?.practitionerTagged}
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      {showClientTestimonials ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Client_Testimonial
              setShowClientTestimonials={setShowClientTestimonials}
              doc={patient?.practitionerTagged}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Patient_Profile;