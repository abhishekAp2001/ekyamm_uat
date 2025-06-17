import Image from "next/image";
import React from "react";

const All_clinics = ({ list }) => {
  return (
    <>
      <div className="flex justify-between flex-wrap mt-[10.9px]">
        {list?.map((list, index) => (
          <div key={index}
            className="w-1/3 rounded-[65px] flex flex-col items-center gap-1 mb-3.5"
          >
            <Image
              src={"/images/clinic2.png"}
              width={65}
              height={65}
              className="w-[65px] h-[65px] rounded-full object-cover"
              alt={list?.clinicName ||
                  `${list?.generalInformation?.firstName} ${list?.generalInformation?.lastName}`}
            />
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
