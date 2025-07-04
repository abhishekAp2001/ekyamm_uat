import Greeting from "@/components/patient/Greeting";
import PastSessions from "@/components/patient/PastSessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UpcomingSession from "@/components/patient/UpcomingSession";
import { pastSessions, upcomingSession } from "@/lib/utils";
import { LucideFilter, LucideSearch} from "lucide-react";
import React from "react";

const user = {
  name: "Virat Kohli",
  profilePic: "/akshit.png", // Placeholder image
};


// Main Page Component
const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DFDAFB] to-[#F9CCC5] max-w-[480px] mx-auto">
      <div className="bg-gradient-to-r from-[#B0A4F5] to-[#EDA197] pb-3 rounded-b-lg ">
        <Greeting name={user?.name} profilePic={user?.profilePic} />
        {/* Search Bar */}
        <div className="flex space-x-2 px-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search Psychologists..."
              className="bg-white rounded-lg py-[11px] px-4"
            />
            <LucideSearch className="w-[18px] h-[18px] absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button variant="outline" className=" rounded-lg p-[14px]">
            <LucideFilter className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* Upcoming Session */}
      <UpcomingSession sessions={upcomingSession} />
      {/* Past Sessions */}
      <PastSessions sessions={pastSessions} />
      <div className="p-4">
        <button className="w-full bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white rounded-lg py-[14.5px] text-lg">
          Schedule Now
        </button>
      </div>
    </div>
  );
};

export default Page;
