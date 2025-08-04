"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import SS_Header from "../SS_Header/SS_Header";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { getCookie } from "cookies-next";
import axios from "axios";
import { patientSessionToken as getPatientSessionToken, getStorage } from "@/lib/utils";
import { showErrorToast } from "@/lib/toast";
import { Baseurl } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useRememberMe } from "@/app/context/RememberMeContext";
const Sessions_Synopsis = () => {
  const { rememberMe } = useRememberMe();
  const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [synopsis, setSynopsis] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter()
  const sessionDates = [
    "21 March 2022",
    "21 March 2022",
    "03 February 2022",
    "01 February 2022",
    "23 January 2022",
  ];
  useEffect(() => {
    const token = getPatientSessionToken();
    setPatientSessionToken(token);
  }, []);
  
  useEffect(() => {
    if (!patientSessionToken) return;
    const getPatientSynopsis = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient?type=synopsis`, {
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          setSynopsis(response?.data?.data.sessionSynopsis);
        }
      } catch (err) {
        console.log("err", err);
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      } finally {
        setLoading(false);
      }
    };
    getPatientSynopsis();
  }, [patientSessionToken]);
  function formatUTCDateSimple(utcDateStr) {
    const date = new Date(utcDateStr);

    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  }
  const [patient, setPatient] = useState(null);

useEffect(() => {
  // const cookie = getCookie("PatientInfo");
  const cookie = getStorage("PatientInfo", rememberMe);
  if (cookie) {
    try {
      setPatient(cookie);
    } catch (err) {
      console.error("Error parsing cookie", err);
    }
  }
  else if(!cookie){
    router.push('patient/login')
  }
}, []);
  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-screen flex flex-col max-w-[576px] mx-auto">
      <SS_Header />
      <div className="h-full overflow-y-auto px-[17px]">
        {/* Profile Card */}
        <div className="mb-6 bg-[#FFFFFF80] rounded-[9px] p-3 mt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-[42px] h-[42px]">
              <AvatarImage
                src={patient?.profileImageUrl||"/images/profile.png"}
                alt={`${patient?.firstName} ${patient?.lastName}`}
                className="rounded-full object-fill"
              />
            </Avatar>
            <div>
              <p className="text-[14px] font-[600] text-black">{patient?.firstName} {patient?.lastName}</p>
              <p className="text-[11px] font-[500] text-gray-500">
                +91 {patient?.primaryMobileNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        { loading ? (<div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" /></div>):(
                  <Accordion type="single" collapsible className="flex flex-col gap-3">
          {synopsis && synopsis?.length > 0 ? (
            synopsis?.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="bg-[#FFFFFF80] rounded-[9px]"
            >
              <AccordionTrigger className="px-4 py-4 text-[14px] font-[600] text-black flex justify-between"
              onClick={() => {
                    setSelectedItem(item);
                    setDrawerOpen(true);
                  }}
              >
                {formatUTCDateSimple(item.date)}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-gray-600">
                {item?.synopsisNote}
              </AccordionContent>
            </AccordionItem>
          ))
          ):(
            <div>
            </div>
          )}
        </Accordion>
        )}


        {/* Done Button */}
        <div className="mt-6 pb-6">
          {/* <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px]">
            Done
          </Button> */}
          <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] rounded-[8px] w-full h-[45px] mb-[26px]">
                Done
          </Button>
          <Drawer className="pt-[9.97px]" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <DrawerContent className="bg-gradient-to-b from-[#e7e4f8] via-[#f0e1df] via-70% to-[#feedea] bottom-drawer p-[22.5px_34px_20px_34px]">
              <DrawerHeader className="p-0">
                <DrawerDescription className="flex flex-col gap-3">
                  <div className="flex justify-center relative">
                    <span className="text-[16px] font-[600] text-black">
                      Share Sessions Synopsis
                    </span>

                    {/* ✅ Fixed Close Button */}
                    <DrawerClose asChild>
                      <button className="absolute right-[-10px] top-[-10px] cursor-pointer">
                        <Image
                          src="/images/close.png"
                          width={26}
                          height={24}
                          alt="close"
                        />
                      </button>
                    </DrawerClose>
                  </div>

                  <div className="h-[210px] bg-[#FFFFFF] rounded-[12px] p-4 flex flex-col gap-[18px]">
                    <p className="text-sm font-medium">
                      {selectedItem ? selectedItem?.synopsisNote : "No synopsis available"}
                    </p>
                    <div className="relative flex items-center justify-center w-full h-[110.21px] rounded-[9px] border-[0.93px] bg-[#000000]">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="absolute inset-0 top-[35px] flex items-center justify-center"
                          >
                            {
                              selectedItem?.synopsisNoteImageUrl? (
                                <Image
                              src={selectedItem?.synopsisNoteImageUrl}
                              width={18}
                              height={18}
                              alt="preview"
                              className="bg-transparent"
                            />)
                              :(
                                <Image
                                  src="/images/preview.png"
                                  width={18}
                                  height={18}
                                  alt="preview"
                                  className="bg-transparent"
                                />
                              )
                            }
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="h-[65vh] bg-[#0000009c] text-white">
                          <div className="flex flex-col items-center justify-center h-full">
                            {selectedItem?.synopsisNoteImageUrl ? (
                              <Image
                                src={selectedItem?.synopsisNoteImageUrl}
                                alt="Synopsis Note"
                                width={500}
                                height={500}
                                className="object-contain"
                              />
                            ) : (
                              <p className="text-white text-center">
                                No image available for this synopsis.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-3 mt-[20.35px] w-full">
                    <DrawerClose asChild>
                      <Button className="border border-[#CC627B] bg-transparent text-[14px] font-[600] text-[#CC627B] py-[14.5px] rounded-[8px] w-[48%] h-[45px]">
                        Cancel
                      </Button>
                    </DrawerClose>
                    <Button className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[14px] font-[600] text-white py-[14.5px] rounded-[8px] w-[48%] h-[45px]">
                      Share
                    </Button>
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="p-0" />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Sessions_Synopsis;
