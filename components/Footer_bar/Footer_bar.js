import Image from "next/image";
import React from "react";
 
const Footer_bar = () => {
  return (
    <>
      <div className="flex gap-1 items-center">
        <span className="text-[10px] text-gray-500 font-medium">
          Powered by
        </span>
        <Image
          src="/images/ekyamm.png"
          width={100}
          height={49}
          className="w-[106px] mix-blend-multiply"
          alt="ekyamm"
        />
      </div>
    </>
  );
};
 
export default Footer_bar;