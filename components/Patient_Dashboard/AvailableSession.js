import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// AvailableSession shows session credits and a loader when fetching
export default function AvailableSession({ loading = false, patient }) {
  const { availableCredits = 0, totalCredits = 0 } = patient || {};
  
  const onBookSession = () => {};

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
            {availableCredits}/{totalCredits}
          </span>
          <span className="max-[376px]:text-[10px] text-xs font-medium text-[#6D6A5D]">
            Available Sessions
          </span>
        </div>
        <div className="rounded-full bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] p-[1px] h-6">
          <Button
            onClick={onBookSession}
            className="bg-[#f2ecf9] text-[11px] text-black rounded-full h-full flex items-center gap-1 px-2 py-1"
          >
            <Plus className="w-[10px] text-[#776EA5]" />
            {availableCredits > 0 ? 'Book Session' : 'Add Package'}
          </Button>
        </div>
      </div>
    </div>
  );
}
