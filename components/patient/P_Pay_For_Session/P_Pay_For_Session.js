"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import Footer_bar from "../../Footer_bar/Footer_bar";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { MapPin } from "lucide-react";
import BackNav from "../../BackNav";
import {
  calculatePaymentDetails,
  clinicSharePercent,
  formatAmount,
} from "@/lib/utils";
import Confirm_Header from "../../Confirm_Header";
import { selectedCounsellorData as getSelectedCounsellorData } from "@/lib/utils";
import { format } from "date-fns";
import axios from "axios";
import { Baseurl } from "@/lib/constants";
import { string } from "i/lib/util";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";
const P_Pay_For_Session = ({ type }) => {
  const selectedCounsellorData = getSelectedCounsellorData()
  const [session, setSession] = useState(null)
  const price = session?.total
  const sessions = session?.session_count
  const [clinicShare, setClinicShare] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [total, setTotal] = useState(0);
  const [PatientInfo, setPatientInfo] = useState(null);
  const [channelPartnerData, setChannelPartnerData] = useState(null);
  const [token, setToken] = useState(null)
  const [formFields, setFormFields] = useState(null);
  const payuFormRef = useRef(null);
  const router = useRouter()
  useEffect(() => {
    const cookie = getCookie("patientSessionData");
    if (cookie) {
      try {
        setToken(JSON.parse(cookie));
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
    else if (!cookie) {
      router.push('/login')
    }
  }, []);
  useEffect(() => {
    const cookie = getCookie("session_selection");
    if (cookie) {
      try {
        setSession(JSON.parse(cookie));
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
    else if (!cookie) {
      router.push('/login')
    }
  }, []);

  useEffect(() => {
    const cookie = getCookie("PatientInfo");
    if (cookie) {
      try {
        setPatientInfo(JSON.parse(cookie));
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
    else if (!cookie) {
      router.push('/login')
    }
  }, []);


  useEffect(() => {
    const calculatePrice = () => {
      const result = calculatePaymentDetails(
        price,
        sessions,
        clinicSharePercent,
      );
      setClinicShare(result.clinicShare || 0);
      setTotal(result?.total || 0);
      setTotalPayable(result?.totalPayable || 0);
    };
    calculatePrice();
  }, [
    price,
    sessions
  ]);
  const handlePayment = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient/sessionCredits/refill`, {
        "practitionerId": selectedCounsellorData?.loginId,
        "sessionCreditCount": String(session?.session_count),
        "sessionPrice": String(session?.total),
      },
        { headers: { accesstoken: token.token } })
      if (response?.data?.success) {
        const payuPayload = response?.data?.data?.payuPayload
        payuPayload.fields.surl = "http://localhost:3000/api/success"
        payuPayload.fields.furl = "http://localhost:3000/api/failure"
        // payuPayload.fields.surl = "https://hmfbknn3-3000.inc1.devtunnels.ms/api/success"
        // payuPayload.fields.furl = "https://hmfbknn3-3000.inc1.devtunnels.ms/api/failure"
        setFormFields(payuPayload);
      }
    } catch (error) {
      console.error("Error", error)
    }
  }
  useEffect(() => {
    if (formFields) {
      payuFormRef.current?.submit();
    }
  }, [formFields]);
  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px] mx-auto">
        <div className="bg-[#f6f4fd]">
          <BackNav className='text-[16px]'
            title="Pay for Sessions"
            to={`/patient/select-package`}
          />
        </div>
        <div className="h-full flex flex-col overflow-auto px-[13px]  bg-gradient-to-b from-[#DFDAFB] to-[#F9CCC5]">
          <div className="mt-10 bg-[#FFFFFF] rounded-[9px] p-5 relative">
            <strong className=" flex text-[20px] font-[600] text-black items-center justify-center">
              Session
            </strong>
            <p className="text-center mb-4">
              <span className="text-sm text-[#776EA5] font-black">Friday, 11 December 2024 | 11:00 AM</span>
            </p>
            <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2 flex justify-between px-2">
              <div>
                <span className="text-[15px] font-medium text-[#000000] ml-1">
                  Patient Name:
                </span>
                <div className="text-[15px] font-[600] text-black ml-1">
                  {PatientInfo?.firstName} {PatientInfo?.lastName}
                </div>
              </div>
              <div>
                <span className="text-[15px] font-medium text-[#000000] ml-1">
                  Practitioner Name:
                </span>
                <div className="text-[15px] font-[600] text-black ml-1">
                  {selectedCounsellorData?.generalInformation?.firstName} {selectedCounsellorData?.generalInformation?.lastName}
                </div>
              </div>
            </div>

            <div className="mb-3 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2 flex justify-between px-2">
              <div>
                <span className="text-[15px] font-medium text-[#000000] ml-1">
                  session Mode:
                </span>
                <div className="text-[15px] font-[600] text-black ml-1">
                  {selectedCounsellorData?.practiceDetails?.type}
                </div>
              </div>
            </div>
            <div className="flex mb-3 justify-between mt-2  pt-2 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <div className="flex flex-col">
                <span className="text-[15px] font-[400] text-black ml-1">
                  Session Fee:
                </span>
                <span className="text-[15px] font-[400] text-black ml-1">
                  Transaction Fee:
                </span>
                <span className="text-[15px] font-[400] text-black ml-1">
                  GST:
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-[700] text-black mr-1">
                  {/* <span className="mx-8">₹</span>
                {Number(sessions_selection?.sessionPrice) *
                  Number(sessions_selection?.sessionCreditCount)} */}
                  {total}
                </span>

                <span className="text-[15px] font-[700] text-black mr-1">
                  {/* <span className="mx-8">₹</span>
                {Number(sessions_selection?.sessionPrice) *
                  Number(sessions_selection?.sessionCreditCount)} */}
                  {formatAmount(50)}
                </span>
                <span className="text-[15px] font-[700] text-black mr-1">
                  {/* <span className="mx-8">₹</span>
                {Number(sessions_selection?.sessionPrice) *
                  Number(sessions_selection?.sessionCreditCount)} */}
                  {formatAmount(100)}
                </span>
              </div>
            </div>

            <div className="flex mb-3 justify-between mt-2  pt-2 bg-gradient-to-r from-[#BBA3E433] to-[#EDA19733] rounded-[12px] p-2">
              <span className="text-[15px] font-[700] text-black ml-1">
                Total:
              </span>
              <span className="text-[15px] font-[700] text-black mr-1">
                {total}
              </span>
            </div>
            <Button className="w-full bg-[#776EA5] rounded-[8px]"
              onClick={() => { handlePayment() }}>
              Pay to confirm session
            </Button>
          </div>
          {/* <div className="bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] flex flex-col items-center gap-3  py-[23px] px-[17px] left-0 right-0 ">
            <Footer_bar />
          </div> */}
        </div>
        <div>
          {formFields && (
            <form
              ref={payuFormRef}
              action={formFields.action}
              method="post"
              style={{ display: "none" }}
            >
              {Object.entries(formFields.fields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              <input type="submit" value="Submit" />
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default P_Pay_For_Session;
