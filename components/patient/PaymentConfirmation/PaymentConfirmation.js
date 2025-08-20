'use client';
import React, { useState, useEffect, useRef } from 'react'
import { getCookie, setCookie } from 'cookies-next'
import BackNav from '@/components/BackNav';
import { Button } from '@/components/ui/button';
import { selectedCounsellorData as getSelectedCounsellorData, getStorage, setStorage } from '@/lib/utils';
import { calculatePaymentDetails, formatAmount } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useReactToPrint } from "react-to-print";
import Invoice from '@/components/channel-partner/PaymentConfirmation/Invoice';
import Footer_bar from '@/components/Footer_bar/Footer_bar';
import { useRememberMe } from '@/app/context/RememberMeContext';
import html2pdf from "html2pdf.js";
const PaymentConfirmation = () => {
  const {rememberMe} = useRememberMe()
  const targetRef = useRef()
  const router = useRouter()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("txnid")
  const selectedCounsellorData = getSelectedCounsellorData()
  const [session, setSession] = useState(null)
  const price = session?.total
  const sessions = session?.session_count
  const [PatientInfo, setPatientInfo] = useState(null);
  const [total, setTotal] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    // const cookie = getCookie("session_selection");
    const cookie = getStorage("session_selection", rememberMe);
    if (cookie) {
      try {
        const cookieObj = cookie
        cookieObj.txnId = transactionId;
        let maxAge = {}
        if(rememberMe){
          maxAge = { maxAge: 60 * 60 * 24 * 30 }
        }
        else if(!rememberMe){
          maxAge = {}
        }
        // setCookie("session_selection", JSON.stringify(cookieObj),maxAge);
        setStorage("session_selection", cookieObj, rememberMe, 2592000 );
        setSession(cookieObj);
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
    else if(!cookie){
      router.push('/patient/login')
    }
  }, []);
  useEffect(() => {
    // const cookie = getCookie("PatientInfo");
    const cookie = getStorage("PatientInfo", rememberMe);
    if (cookie) {
      try {
        setPatientInfo(cookie);
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
    else if(!cookie){
      router.push('/patient/login')
    }
  }, []);

  useEffect(() => {
    const calculatePrice = () => {
      const result = calculatePaymentDetails(
        price,
        sessions,
        10,
      );
      setTotal(result?.total || 0);
    };
    calculatePrice();
  }, [
    price,
    sessions
  ]);

  useEffect(() => {
    if (secondsLeft === 0) {
      // router.push(`/patient/dashboard`);
      return;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router]);

  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      body { font-size: 14px; color: red; }
      .no-print { display: none; }
    `,
  });
  
    const handleDownload = () => {
    const patient = getStorage("PatientInfo", rememberMe);
    const paymentStatusInfo = getStorage("paymentStatusInfo")
    const sessions_selection = getStorage("session_selection",rememberMe)
    const InvoiceNumber = paymentStatusInfo?.invoiceId?.trim() ? paymentStatusInfo.invoiceId : sessions_selection?.txnId
    const element = targetRef.current;
  element.style.display = "block";
    const opt = {
      margin:       0.5,
      filename:     `${patient?.firstName} ${patient?.lastName}- ${InvoiceNumber}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = "none";
    });;
  };
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
          <div className="mt-3 mb-3 bg-[#FFFFFF] rounded-[9px] flex flex-col p-2 justify-center">
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
                {transactionId}
              </span>
            </div>
          </div>
          <div className="bg-[#FFFFFF] rounded-[9px] p-5 relative">
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
            <Button className="w-full bg-[#776EA5] rounded-[8px] h-[40px] text-[15px]"
              onClick={() => { handlePrint() }}>
              Download Receipt
            </Button>
            <Button className="w-full bg-white rounded-[8px] mt-2 h-[40px] text-[17px] border-1 border-[#776EA5] text-[#776EA5] font-bold"
              onClick={() => { router.push('/patient/dashboard') }}>
              Dashboard
            </Button>
            <div className="flex justify-center mt-2 text-[12px] text-[#000000] opacity-30 font-[500]">
              Moving to Dashboard in {secondsLeft} seconds
            </div>
          </div>
          <div className=" flex flex-col items-center gap-3  py-[23px] px-[17px] left-0 right-0 ">
            <Footer_bar />
          </div>
        </div>
      </div>
      <div ref={targetRef}>
        <Invoice />
      </div>
    </>
  );
}

export default PaymentConfirmation
