"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../../ui/button";
import Link from "next/link";
import Image from "next/image";
import Footer_bar from "../../Footer_bar/Footer_bar";
import BackNav from "../../BackNav";
import { MapPin } from "lucide-react";
import { getCookie, hasCookie } from "cookies-next";
import { calculatePaymentDetails, clinicSharePercent } from "@/lib/utils";
import Pay_Header from "../../sales/channel_partner/Pay_Header";
import axiosInstance from "@/lib/axiosInstance";
import { Baseurl, BaseurlPay } from "@/lib/constants";
import QRCode from 'qrcode'
import axios from "axios";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
const Payment = ({ type }) => {
  const router = useRouter()
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [qrCode, setQrCode] = useState("");
  // const [billingType, setBillingType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [totalPayable, setTotalPayable] = useState(0);
  const sessions_selection = hasCookie("sessions_selection")
    ? JSON.parse(getCookie("sessions_selection"))
    : null;
  const invitePatientInfo = hasCookie("invitePatientInfo")
    ? JSON.parse(getCookie("invitePatientInfo"))
    : null;
  useEffect(() => {
    const cookieData = getCookie("channelPartnerData");
    const patientData = getCookie("invitePatientInfo");
    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData);
        setChannelPartnerData(parsedData);
        // setBillingType(parsedData?.billingType);
      } catch (error) {
        setChannelPartnerData(null);
      }
    } else {
      setChannelPartnerData(null);
      router.push(`/channel-partner/${type}`);
    }
  }, [type]);

  useEffect(() => {
    const calculatePrice = () => {
      const result = calculatePaymentDetails(
        sessions_selection?.sessionPrice,
        sessions_selection?.sessionCreditCount,
        clinicSharePercent
      );
      setTotalPayable(result?.totalPayable || 0);
    };
    calculatePrice();
  }, [
    sessions_selection?.sessionPrice,
    sessions_selection?.sessionCreditCount,
  ]);

useEffect(() => {
  const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: {
      width: screen.width,
      height: screen.height,
      orientation: screen.orientation?.type || 'unknown'
    }
  };

  function objectToLiteralString(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    let result = '';

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        result += `${spaces}${key}: {\n${objectToLiteralString(value, indent + 2)}${spaces}},\n`;
      } else if (typeof value === 'string') {
        result += `${spaces}${key}: "${value}",\n`;
      } else {
        result += `${spaces}${key}: ${value},\n`;
      }
    }

    return result;
  }

  const getIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log("IP after get:", data.ip);
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP:", error);
      return "";
    }
  };

  const getQrString = async (ip, literalDeviceInfo) => {
    try {
      const response = await axios.post(`${Baseurl}/v2/cp/patient/sessionCredits`, {
        channelPartnerUsername: type,
        cp_patientId: invitePatientInfo?._id,
        sessionCreditCount: sessions_selection?.sessionCreditCount,
        sessionPrice: String(sessions_selection?.sessionPrice+(sessions_selection?.sessionPrice*0.1)),
        clientDetails: {
          ip: String(ip),
          deviceInfo: literalDeviceInfo
        },
      });
      if (response?.data?.success) {
        setCookie("qrCodeInfo", JSON.stringify(response?.data?.data));
        setOrderId(response?.data?.data?.orderId);
        generateQrCode(response?.data?.data?.upiIntent);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const doFlow = async () => {
    const literalDeviceInfo = objectToLiteralString(deviceInfo); // ✅ FIX: pass the object!
    const ip = await getIP();
    await getQrString(ip, literalDeviceInfo);
  };

  doFlow();
}, []);

  const generateQrCode = async (upiIntent) => {
    try {
      const dataUrl = await QRCode.toDataURL(upiIntent)
      setQrCode(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }
  useEffect(() => {
    if (!orderId) return; // Don't start interval until orderId is set

    const interval = setInterval(() => {
      if (orderId)
        checkStatus(orderId);
    }, 10000);

    async function checkStatus(orderId) {
      try {
        const response = await axios.post(`${Baseurl}/v2/order/${orderId}/status`, {
          channelPartnerUsername: type,
          cp_patientId: invitePatientInfo?._id,
        });
        if (response?.data?.success) {
          if (response?.data?.data?.status == "success") {
            setCookie("paymentStatusInfo", JSON.stringify(response?.data?.data));
            router.push(`/channel-partner/${type}/payment-confirmation`)
          }
          if (response?.data?.data?.status !== "success" && response?.data?.data?.status !== "initiated") {
            showErrorToast("Payment Failed");
            setTimeout(() => {
              router.push(`/channel-partner/${type}/pay-for-sessions`);
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
    }

    return () => clearInterval(interval);
  }, [orderId, type, invitePatientInfo?._id]);
  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px] mx-auto">
        <Link href={`/channel-partner/${type}/pay-for-sessions`}>
          <Pay_Header />
        </Link>
        <div className="h-full flex flex-col overflow-auto  bg-gradient-to-b from-[#DFDAFB] to-[#F9CCC5]">
          <div className="flex flex-col h-fit mx-auto relative mt-4 mb-4 ">
            <div className="w-full text-[#776EA5] font-semibold text-[20px] leading-[25px] text-center">
              {channelPartnerData?.clinicName}
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="bg-[#776EA5] rounded-full w-[16.78px] h-[16.78px] flex justify-center items-center">
                <MapPin color="white" className="w-[12.15px] h-[12.15px]" />
              </div>
              <span className="text-sm text-[#776EA5] font-medium">
                {channelPartnerData?.area}
              </span>
            </div>
          </div>
          <div className="h-full px-[17px] flex flex-col justify-between ">
            <div className="bg-[#FFFFFF] rounded-[9px] p-5">
              <strong className=" flex text-[30px] font-[700] text-[#776EA5] items-center justify-center mb-4">
                Pay {totalPayable}
              </strong>

              <div className="mb-3 flex justify-center">
                <span className="text-[34px] font-[500] text-[#000000]">
                  Scan to Pay
                </span>
              </div>
              <Link href={`/channel-partner/${type}/payment-confirmation`}>
                <div className="mb-3 flex justify-center">
                  {qrCode ? (<Image
                    src={qrCode}
                    width={224}
                    height={224}
                    alt="UPI QR Code"
                  />) : (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  )}
                </div>
              </Link>
              <div className="flex justify-center mt-5">
                <Link href={`/channel-partner/${type}/pay-for-sessions`}>
                  <Button className="bg-[#776EA5] text-[15px] font-[700] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-[304px] h-[45px]">
                    Back
                  </Button>
                </Link>
              </div>
            </div>

            {/* <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex flex-col justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4">
            <Footer_bar />
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
