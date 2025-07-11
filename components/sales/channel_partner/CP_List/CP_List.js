"use client";
import React, { useEffect, useState } from "react";
import All_clinics from "../../All_clinics/All_clinics";
import { ChevronLeft } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import List from "./CPList";
import CPList from "./CPList";

const CP_List = () => {
  const axios = axiosInstance();
  const [channelPartnerList, setChannelPartnerList] = useState([]);
  const fetchAllList = async () => {
    try {
      const response = await axios.get(`v2/cp/channelPartner`);
      setChannelPartnerList(response?.data?.data);
    } catch (error) {
      if (error.forceLogout) {
        router.push("/login");
      } else {
        showErrorToast(error?.response?.data?.error?.message);
      }
    }
  };

  useEffect(() => {
    fetchAllList();
  }, []);
  return (
    <>
      <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] h-full flex flex-col max-w-[576px] mx-auto">
        <div className="px-[17px] h-full mb-[10%] overflow-auto">
          <div className="sticky top-0 left-0 right-0 z-10 bg-[#efecfa]">
            <div className="flex items-center p-4 px-0 gap-[9px]">
              <Link href="/sales">
                <ChevronLeft size={24} className=" text-black-700" />
              </Link>
              <div className="flex-1 text-[16px] font-semibold text-gray-800">
                Channel Partner List
              </div>
              <div className="h-6 w-6" /> {/* Space */}
            </div>
          </div>
       
           <div className="bg-[#FFFFFF80] pt-[8.21px] pb-3.5 border=[1.47px] border-[#FFFFFF4D] rounded-2xl">
          <div className="flex justify-between items-center ps-2 pe-[16.93px]">
            
          </div>
          <div className="px-[10px] ">
            <CPList list = {channelPartnerList}/>
          </div>
        </div>
         </div>
      </div>
    </>
  );
};

export default CP_List;
