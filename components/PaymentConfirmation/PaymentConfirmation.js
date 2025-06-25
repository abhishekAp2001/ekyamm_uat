"use client";
import React, { useEffect, useState } from "react";

import { Button } from "../ui/button";
import Link from "next/link";

import Footer_bar from "../Footer_bar/Footer_bar";
import Confirm_Header from "../Confirm_Header";
import { MapPin } from "lucide-react";
import { getCookie, hasCookie } from "cookies-next";
import { showSuccessToast } from "@/lib/toast";
import { calculatePaymentDetails, clinicSharePercent, formatAmount } from "@/lib/utils";

const PaymentConfirmation = ({ type }) => {
  const [channelPartnerData, setChannelPartnerData] = useState(null);
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
        // console.log('error',error)
        setChannelPartnerData(null);
      }
    } else {
      setChannelPartnerData(null);
      router.push(`/channel-partner/${type}`);
    }

    // if (patientData) {
    //   try {
    //     const parsedData = JSON.parse(patientData);
    //     setPatientPreviousData(parsedData);
    //     setFormData((prev) => ({
    //       ...prev,
    //       cp_patientId: parsedData?._id || "",
    //     }));
    //     console.log("patient", parsedData);
    //   } catch (error) {
    //     setPatientPreviousData(null);
    //   }
    // } else {
    //   setPatientPreviousData(null);
    //   router.push(`/channel-partner/${type}`);
    // }
    showSuccessToast("Patient Invited & Sessions Created");
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
        <Link href={`/channel-partner/${type}/payment`}>
          <Confirm_Header />
        </Link>
        <div className="flex flex-col h-fit mx-auto relative mt-4 mb-4">
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
        <div className=" h-full flex flex-col justify-between">
          {/* <div className="flex justify-center mx-auto relative mt-4">
            <span className="text-[#776EA5] font-[600] text-[20px]">
              Cloudnine Hospital
            </span>
          </div> */}

          <div className=" px-[17px] bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] flex flex-col justify-between  ">
            <div className="mb-3 bg-[#FFFFFF] rounded-[9px] flex flex-col p-2 justify-center">
              <div className=" flex  justify-between">
                <span className="text-[15px] font-[400] text-[#000000] ml-1">
                  Payment Status:
                </span>
                <span className="text-[15px] font-[400] text-black mr-1">
                  Transaction ID:
                </span>
              </div>

              <div className=" flex justify-between ">
                <span className="text-[15px] font-[600] text-[#000000] ml-1">
                  Paid
                </span>
                <span className="text-[15px] font-[600] text-black mr-1">
                  8163619319
                </span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-[9px] p-4">
              <strong className=" flex text-[20px] font-[600] text-black items-center justify-center mb-4">
                Package Credit Confirmation
              </strong>

              <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[8px] p-2">
                <div className="flex flex-col tracking-normal">
                  <span className="text-[15px] font-[400] text-[#000000] ml-1">
                    Patient Name:
                  </span>
                  <span className="text-[15px] font-[600] text-black ml-1">
                    {invitePatientInfo?.firstName} {invitePatientInfo?.lastName}
                  </span>
                </div>
              </div>

              <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[8px] p-2">
                <div className=" flex  justify-between  ">
                  <span className="text-[15px] font-[400] text-[#000000] ml-1 ">
                    Number of Sessions:
                  </span>
                  <span className="text-[15px] font-[600] text-black mr-1">
                    {sessions_selection?.sessionCreditCount}
                  </span>
                </div>

                <div className=" flex justify-between ">
                  <span className="text-[15px] font-[400] text-[#000000] ml-1">
                    Session Fee (Hourly):
                  </span>
                  <span className="text-[15px] font-[700] text-black mr-1">
                    {formatAmount(sessions_selection?.sessionPrice || 0)}
                  </span>
                </div>
              </div>

              <div className="mb-3  flex justify-between mt-2   bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[8px] p-2">
                <span className="text-[15px] font-[700] text-black ml-1">
                  Total:
                </span>
                <span className="text-[15px] font-[700] text-black mr-1">
                  {totalPayable}
                </span>
              </div>

              <div className=" mt-3">
                <Link href="#">
                  <Button className="bg-[#776EA5] text-[15px] font-[700] text-white rounded-[8px] flex items-center justify-center w-full h-[45px]">
                    Download Receipt
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center mt-2 text-[12px] text-[#000000] opacity-30 font-[500]">
                Moving to homepage in 30 seconds
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-6 mb-[20px]">
            <div className="bg-gradient-to-t from-[#fce8e5] to-[#fce8e5] flex flex-col justify-between items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 px-4 max-w-[576px] mx-auto">
              <Footer_bar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentConfirmation;
