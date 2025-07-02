import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const All_clinics = ({ list }) => {
  return (
    <>
      <div className="flex flex-wrap mt-[10.9px]">
        {list?.map((list, index) => (
          <div
            key={index}
            className="w-1/3 rounded-[65px] flex flex-col items-center gap-1 mb-3.5"
          >
            <Avatar>
              <AvatarImage
                src={list?.generalInformation?.profileImageUrl}
                alt={`${list?.generalInformation?.firstName} ${list?.generalInformation?.lastName}`}
              />
              <AvatarFallback>
                {list?.clinicName
                  ? list.clinicName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : `${list?.generalInformation?.firstName?.[0] || ""}${
                      list?.generalInformation?.lastName?.[0] || ""
                    }`.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-[14px] text-black font-medium whitespace-pre-line text-center">
                {list?.clinicName ||
                  `${list?.generalInformation?.firstName} ${list?.generalInformation?.lastName}`}
                <br />
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default All_clinics;
