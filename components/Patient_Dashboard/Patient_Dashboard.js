"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Funnel, MapPin, Menu, Plus } from "lucide-react";
import { Accordion } from "../ui/accordion";
import DoctorCard from "../DoctorCard";
import SessionDrawer from "../SessionDrawer";
import {
  doctors,
  // currentPatientId as getCurrentPatientId,
  patientSessionToken as getPatientSessionToken,
} from "@/lib/utils";
import Header from "./Header";
import { Baseurl } from "@/lib/constants";
import axios from "axios";
import { showErrorToast } from "@/lib/toast";
import { setCookie } from "cookies-next";
import AvailableSession from "./AvailableSession";

const Patient_Dashboard = () => {
  const [patient, setPatient] = useState(null);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const patientSessionToken = getPatientSessionToken();
  // const currentPatientId = getCurrentPatientId();

  useEffect(() => {
    const getPatient = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Baseurl}/v2/cp/patient/`, {
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          setCookie("PatientInfo", JSON.stringify(response?.data?.data));
          setPatient(response?.data?.data);
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

    const getCounsellors = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${Baseurl}/v2/cp/counsellors`, {
          params: {},
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          console.log(response?.data?.data);
          setCounsellors(response?.data?.data);
        } else {
          setCounsellors([]);
          showErrorToast(res.data.error?.message || "Fetch failed");
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
    getCounsellors();
    getPatient();
  }, []);

  return (
    <>
      <div className="relative h-screen max-w-[576px]  flex flex-col">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-8 bg-[#e7d6ec] max-w-[576px] mx-auto">
          {/* Gradient Header */}
          <Header loading={loading} patient={patient} />

          {/* Available Session Section */}
          <AvailableSession loading={loading} patient={patient} />
        </div>

        {/* Scrollable Body */}
        <div className="mt-[192px] flex-1 overflow-y-auto px-3 pb-5">
          {/* Filter Row */}
          <div className="flex justify-between items-center my-2">
            <strong className="text-sm text-black font-semibold">
              Available Counsellors
            </strong>
            <Button className="text-sm text-[#776EA5] rounded-full h-6 flex items-center gap-1 bg-transparent shadow-none px-2">
              <Funnel className="w-[13px] text-[#776EA5]" />
              Filter
            </Button>
          </div>

          {/* Doctor List */}
          <Accordion type="multiple" className="space-y-3">
            {counsellors.map((counsellor, _x) => (
              <DoctorCard
                key={_x}
                doc={counsellor}
                onBookClick={() => setIsDrawerOpen(true)}
              />
            ))}
          </Accordion>
        </div>

        {/* Session Booking Drawer */}
        <SessionDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      </div>
    </>
  );
};

export default Patient_Dashboard;
