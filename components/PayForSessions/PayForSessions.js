"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Footer_bar from "../Footer_bar/Footer_bar";
import { getCookie, hasCookie } from "cookies-next";
import { MapPin } from "lucide-react";
import BackNav from "../BackNav";
import {
  calculatePaymentDetails,
  clinicSharePercent,
  formatAmount,
} from "@/lib/utils";
import Confirm_Header from "../Confirm_Header";

const PayForSessions = ({ type }) => {
  const [total, setTotal] = useState(0);
  const [clinicShare, setClinicShare] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  const sessions_selection = hasCookie("sessions_selection")
    ? JSON.parse(getCookie("sessions_selection"))
    : null;
  const channelPartnerData = hasCookie("channelPartnerData")
    ? JSON.parse(getCookie("channelPartnerData"))
    : null;
  const invitePatientInfo = hasCookie("invitePatientInfo")
    ? JSON.parse(getCookie("invitePatientInfo"))
    : null;

  useEffect(() => {
    const calculatePrice = () => {
      const result = calculatePaymentDetails(
        sessions_selection?.sessionPrice,
        sessions_selection?.sessionCreditCount,
        clinicSharePercent
      );
      setClinicShare(result.clinicShare || 0);
      setTotal(result?.total || 0);
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
        <BackNav
          title="Pay for Sessions Package"
          to={`/channel-partner/${type}/sessions-selection`}
        />        
        <div className="h-full flex flex-col overflow-auto px-[13px]  bg-gradient-to-b from-[#DFDAFB] to-[#F9CCC5]">
          <div className="flex flex-col py-[22px]">
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
          <div className="bg-[#FFFFFF] rounded-[9px] p-5 relative">
            <strong className=" flex text-[20px] font-[600] text-black items-center justify-center mb-4">
              Package Credit Confirmation
            </strong>
            <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-medium text-[#000000] ml-1">
                Patient Name:
              </span>
              <div className="text-[15px] font-[600] text-black ml-1">
                {invitePatientInfo?.firstName} {invitePatientInfo?.lastName}
              </div>
            </div>
            <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <div className=" flex  justify-between  ">
                <span className="text-[15px] font-[400] text-[#000000] ml-1 pb-2">
                  Number of Sessions:
                </span>
                <span className="text-[15px] font-[600] text-black mr-1">
                  {sessions_selection?.sessionCreditCount}
                </span>
              </div>

              <div className=" flex justify-between ">
                <span className="text-[15px] font-[400] text-[#000000] ml-1">
                  Session Fee (Hourly):
                  {/* {sessions_selection?.sessionCreditCount} */}
                </span>
                <span className="text-[15px] font-[700] text-black mr-1">
                  {/* <span className="mx-8">₹</span> */}
                  {formatAmount(sessions_selection?.sessionPrice || 0)}
                </span>
              </div>
            </div>
            <div className="flex mb-3 justify-between mt-2  pt-2 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-[400] text-black ml-1">
                Total:
              </span>
              <span className="text-[15px] font-[700] text-black mr-1">
                {/* <span className="mx-8">₹</span>
                {Number(sessions_selection?.sessionPrice) *
                  Number(sessions_selection?.sessionCreditCount)} */}
                {total}
              </span>
            </div>
            <div className="flex mb-3 justify-between mt-2  pt-2 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-[400] text-black ml-1">
                Clinic Share ({clinicSharePercent}%):
              </span>
              <span className="text-[15px] font-[700] text-black mr-1">
                {clinicShare}
              </span>
            </div>

            <div className="flex mb-3 justify-between mt-2  pt-2 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-[400] text-black ml-1">
                Total Payable:
              </span>
              <span className="text-[15px] font-[700] text-black mr-1">
                {totalPayable}
              </span>
            </div>
            <Link href={`/channel-partner/${type}/payment`}>
              <Button className="w-full bg-[#776EA5]">
                Pay {totalPayable}
              </Button>
            </Link>
          </div>
          {/* <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] flex flex-col items-center gap-3  py-[23px] px-[17px] left-0 right-0 ">
            <Footer_bar />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default PayForSessions;
