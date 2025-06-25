"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import Footer_bar from "../Footer_bar/Footer_bar";
import BackNav from "../BackNav";
import { MapPin } from "lucide-react";
import { getCookie, hasCookie } from "cookies-next";
import { calculatePaymentDetails, clinicSharePercent } from "@/lib/utils";
import Pay_Header from "../Pay_Header";

const Payment = ({ type }) => {
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  // const [billingType, setBillingType] = useState("");
  const [totalPayable, setTotalPayable] = useState(0);
  const sessions_selection = hasCookie("sessions_selection")
    ? JSON.parse(getCookie("sessions_selection"))
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
                <Image
                  src="/images/scan.png"
                  width={224}
                  height={224}
                  alt="UPI QR Code"
                />
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
