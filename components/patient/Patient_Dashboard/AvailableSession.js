'use client';
import React from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { useState, useEffect } from "react";
import { patientSessionToken as getPatientSessionToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";
import { setCookie } from "cookies-next";
import axios from "axios";
import { Baseurl } from "@/lib/constants";
// AvailableSession shows session credits and a loader when fetching
export default function AvailableSession({ loading = false, patient }) {
  const router = useRouter();
  const [patientSessionToken, setPatientSessionToken] = useState(null);
  const [therapist, setTherapist] = useState();
  const { availableCredits = 0, totalCredits = 0 } = patient || {};
  const onBookSession = () => {
    setCookie("selectedCounsellor", JSON.stringify(therapist));
    router.push("/patient/schedule-session");
  };
  const onAddPackage = () => {
    setCookie("selectedCounsellor", JSON.stringify(therapist));
    router.push("/patient/select-package");
  };
  useEffect(() => {
    const token = getPatientSessionToken();
    setPatientSessionToken(token);
  }, []);
  useEffect(() => {
    if (!patientSessionToken) return;
    const getTherapistDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient?type=therapist`, {
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          setTherapist(response?.data?.data?.practitionerTagged[0]);
        }
      } catch (err) {
        console.log("err", err);
        showErrorToast(
          err?.response?.data?.error?.message || "Error fetching patient data"
        );
      } finally {
      }
    };
    getTherapistDetails();
  }, [patientSessionToken]);
  const containerClasses =
    "bg-[#FFFFFF80] px-3 py-2 border border-[#FFFFFF33] rounded-[10px] mx-3 -mt-5 z-20 relative";

  // if loading, show an absolute skeleton matching the container shape
  if (loading) {
    return (
      <div className={containerClasses}>
        <Skeleton className="absolute inset-0 rounded-[10px] h-[48px]" />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/history_2.png"
            width={23}
            height={23}
            className="w-[23px] mix-blend-multiply"
            alt="History"
          />
          <span className="text-2xl font-semibold text-black">
            {availableCredits}
          </span>
          <span className="max-[376px]:text-[10px] text-xs font-medium text-[#6D6A5D]">
            Available Sessions
          </span>
        </div>
        <div className="rounded-full bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] p-[1px] h-6">
          {availableCredits > 0 ? (
            <Button
              onClick={onBookSession}
              className={
                `text-[11px] rounded-full h-full flex items-center gap-1 px-2 py-1 transition-colors ` +
                (patient?.practitionerTagged && patient?.practitionerTagged.length !== 0
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed")
              }
              disabled={!patient?.practitionerTagged || patient?.practitionerTagged.length === 0}
            >
              <Plus className="w-[10px] text-[#776EA5]" />
              Book Session
            </Button>
          ) : (
            <Button
              onClick={onAddPackage}
              className={
                `text-[11px] rounded-full h-full flex items-center gap-1 px-2 py-1 transition-colors ` +
                (patient?.practitionerTagged && patient?.practitionerTagged.length !== 0
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed")
              }
              disabled={!patient?.practitionerTagged || patient?.practitionerTagged.length === 0}
            >
              <Plus className="w-[10px] text-[#776EA5]" />
              Add Package
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
