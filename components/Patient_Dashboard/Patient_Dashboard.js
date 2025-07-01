"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Funnel, Loader2, MapPin, Menu, Plus } from "lucide-react";
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

import Certifications from "../patient/Certifications/Certifications";
import Client_Testimonial from "../patient/Client_Testimonials/Client_Testimonial";
import Profile from "../patient/practitioner/Profile";
import Filter from "../patient/Filter/Filter";
const Patient_Dashboard = () => {
  const [patient, setPatient] = useState(null);
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellors, setSelectedCounsellors] = useState({});
  const [loading, setLoading] = useState(true);
  const [counsellorsLoading, setCounsellorsLoading] = useState(false);
  const [showCounsellorProfile, setShowCounsellorProfile] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showClientTestimonials, setShowClientTestimonials] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filterParams, setFilterParams] = useState({
    language: "",
    sessionFee: "",
    gender: "",
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const patientSessionToken = getPatientSessionToken();

  const handleApplyFilter = (params) => {
    setLoading(true);
    // Simulate API call or processing delay
    setFilterParams(params);
    setShowFilter(false);
    setLoading(false);
  };

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
        setCounsellorsLoading(true);

        
        const response = await axios.get(`${Baseurl}/v2/cp/counsellors`, {
          params: filterParams,
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
        setCounsellors([]);
        console.log("err", err);
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      } finally {
        setCounsellorsLoading(false);
      }
    };
    getCounsellors();
    getPatient();
  }, [filterParams]);

  useEffect(() => {
    let count = 0;
    if (filterParams.gender !== "") count++;
    if (filterParams.language !== "") count++;
    if (filterParams.sessionFee !== "") count++;

    setFilterCount(count);
  }, [filterParams]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5]  relative max-w-[576px] m-auto overflow-y-auto">
        <div className="relative h-screen max-w-[576px]  flex flex-col">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-8 bg-[#e7d6ec] max-w-[576px] mx-auto">
            {/* Gradient Header */}
            <Header
              loading={loading}
              patient={patient}
              filterParams={filterParams}
            />
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
              <Button
                onClick={() => {
                  setShowFilter(true);
                }}
                className="text-sm text-[#776EA5] rounded-full h-6 flex items-center gap-1 bg-transparent shadow-none px-2 relative"
              >
                <Funnel className="w-[13px] text-[#776EA5]" />
                Filter
                {filterCount > 0 ? (
                  <div className="absolute top-[-5px] right-[-5px] bg-white rounded-full w-[18px] h-[18px]">
                    {filterCount}
                  </div>
                ) : (
                  <></>
                )}
              </Button>
            </div>

            {/* Doctor List */}
            {counsellorsLoading ? (
              <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" /></div>
            ) : (
              <>
                <Accordion type="multiple" className="space-y-3">
                  {counsellors.map((counsellor, _x) => (
                    <DoctorCard
                      key={_x}
                      doc={counsellor}
                      onBookClick={() => {
                        setIsDrawerOpen(true);
                      }}
                      setShowCounsellorProfile={setShowCounsellorProfile}
                      setSelectedCounsellors={setSelectedCounsellors}
                    />
                  ))}
                </Accordion>
              </>
            )}
          </div>

          {/* Session Booking Drawer */}
          <SessionDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
      </div>
      
      {showCounsellorProfile ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Profile
              setShowCounsellorProfile={setShowCounsellorProfile}
              setShowCertifications={setShowCertifications}
              setShowClientTestimonials={setShowClientTestimonials}
              doc={selectedCounsellors}
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      {showCertifications ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Certifications
              setShowCertifications={setShowCertifications}
              doc={selectedCounsellors}
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      {showClientTestimonials ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Client_Testimonial
              setShowClientTestimonials={setShowClientTestimonials}
              doc = {selectedCounsellors}
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      {showFilter ? (
        <div className="fixed top-0 left-0 right-0 w-full h-screen bg-white z-90">
          <div className="relative h-screen overflow-y-auto">
            <Filter
              setShowFilter={setShowFilter}
              onApplyFilter={handleApplyFilter}
              initialParams={filterParams}
              loading={loading}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Patient_Dashboard;
