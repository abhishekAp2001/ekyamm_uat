"use client";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Dashboard_card from "../Dashboard_card/Dashboard_card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SalesDashboard = () => {
  return (
    <>
      <div className="bg-gradient-to-r  from-[#B0A4F5] to-[#EDA197] rounded-bl-3xl rounded-br-3xl px-3 py-5 mb-0 fixed top-0 left-0 right-0 max-w-[576px] mx-auto">
        <div className="flex justify-between items-center">
          <Menu color="white" width={24} />
          <Image
            src="/images/ekyamm.png"
            width={100}
            height={49}
            className="w-[106px] pt-1.5 mix-blend-multiply"
            alt="ekyamm"
          />
          <Avatar>
            <AvatarImage src="/images/user.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="px-3 h-full  overflow-auto pt-[20%] lg:pt-[15%]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-[12px] text-gray-500">Good morning,</span>
            <strong className="text-[14px] text-black font-[600] ps-[2px]">
              Chinten Shah
            </strong>
          </div>
          <div className="rounded-full  w-[76px] h-6 inline-block bg-gradient-to-r  from-[#B0A4F5] to-[#EDA197] p-[1px]">
            <Button
              className={
                "bg-gradient-to-r  from-[#DFDAFB] to-[#DFDAFB] text-[11px] text-gray-700 rounded-full w-full h-full flex items-center justify-center gap-1"
              }
            >
              <Plus style={{ width: "10px" }} /> Sales Rep
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center gap-3">
          <Dashboard_card />
        </div>

        {/* Channel Partner */}
        <div className="mt-[12.35px] pt-[8.21px] pb-3.5 border=[1.47px] border-[#FFFFFF4D] rounded-2xl">
          <div className="flex justify-between items-center ps-2 pe-[16.93px]"></div>
          <div className="">
            <div className=" flex flex-col gap-3">
              <div className="bg-[#FFFFFF80] text-black text-[16px] font-[600] py-[17px] p-[8px] flex  justify-between items-center w-full h-[44px] rounded-[8.62px]">
                <div className="flex items-center gap-[7px]">
                  <Image
                    src="/images/bx_clinic.png"
                    width={24}
                    height={24}
                    className="w-[24px]"
                    alt="ekyamm"
                  />
                  Channel Partner
                </div>
                <Link
                  href={"/sales/cp_list"}
                  className="text-[12px] text-gray-500"
                >
                  View All
                </Link>
              </div>

              <div className="bg-[#FFFFFF80] text-black text-[16px] font-[600] py-[17px] p-[8px] flex  justify-between items-center w-full h-[44px] rounded-[8.62px]">
                <div className="flex items-center gap-[7px]">
                  <Image
                    src="/images/bx_clinic.png"
                    width={24}
                    height={24}
                    className="w-[24px]"
                    alt="ekyamm"
                  />
                  Individual Practitioner
                </div>
                <Link
                  href={"/sales/ip_list"}
                  className="text-[12px] text-gray-500"
                >
                  View All
                </Link>
              </div>
              <div className="bg-[#FFFFFF80] text-black text-[16px] font-[600] py-[17px] p-[8px] flex  justify-between items-center w-full h-[44px] rounded-[8.62px]">
                <div className="flex items-center gap-[7px]">
                  <Image
                    src="/images/bx_clinic.png"
                    width={24}
                    height={24}
                    className="w-[24px]"
                    alt="ekyamm"
                  />
                  Clinic
                </div>
                <Link
                  href={"/sales/clinic_list"}
                  className="text-[12px] text-gray-500"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Drawer className="pt-[9.97px] max-w-[576px] m-auto">
            <DrawerTrigger className="mt-[10.8px] bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] h-[45px]  rounded-[8px] flex items-center justify-center w-full">
              Add User
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea]">
              <DrawerHeader>
                <DrawerTitle className="text-[16px] font-[600] text-center">
                  Add User
                </DrawerTitle>
                <DrawerDescription className="mt-6 flex flex-col gap-3">
                  <Link href={"/sales/cp_type"}>
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px]">
                      Channel Partner
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                  </Link>
                  <Link href={"/sales/ip_details"}>
                    <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px]">
                      Individual Practitioner
                      <Image
                        src="/images/arrow.png"
                        width={24}
                        height={24}
                        className="w-[24px]"
                        alt="ekyamm"
                      />
                    </Button>
                  </Link>
                  <Button className="bg-gradient-to-r from-[#BBA3E450] to-[#EDA19750] text-black text-[16px] font-[600] py-[17px] px-4 flex  justify-between items-center w-full h-[50px]">
                    <Link href={""}>Clinic</Link>
                    <Image
                      src="/images/arrow.png"
                      width={24}
                      height={24}
                      className="w-[24px]"
                      alt="ekyamm"
                    />
                  </Button>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="p-0">
                {/* <Button>Submit</Button> */}
                <DrawerClose>
                  <Button
                    variant="outline"
                    className="absolute top-[10px] right-0"
                  >
                    <X className="w-2 h-2 text-black" />
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* footer */}
      <div className="footer_bar bg-[#FFFFFFB2] max-w-[576px] h-[58px] fixed bottom-0 left-0 right-0 flex items-center m-auto">
      {/* <div className="footer_bar bg-[#FFFFFFB2] h-[58px] absolute bottom-0 left-0 right-0 flex items-center"> */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full bg-transparent p-0  h-[58px]">
            <TabsTrigger
              value="dashboard"
              className=" shadow-none active:shadow-none focus:shadow-none"
            >
              <Image
                src="/images/dashboard-icon.png"
                width={28}
                height={24}
                className="w-[28px]"
                alt="dashboard"
              />
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className=" shadow-none active:shadow-none focus:shadow-none"
            >
              <Image
                src="/images/communication.png"
                width={28}
                height={24}
                className="w-10"
                alt="communication"
              />
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="shadow-none active:shadow-none focus:shadow-none"
            >
              <Image
                src="/images/alerts.png"
                width={28}
                height={24}
                className="w-10"
                alt="alerts"
              />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};

export default SalesDashboard;
 
 
