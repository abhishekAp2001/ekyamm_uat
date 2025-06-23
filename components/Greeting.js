import React from 'react';
import Image from 'next/image';

const Greeting = ({ name, profilePic }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex flex-col">
        <div className="text-xs font-medium text-white">Good morning,</div>
        <div className="text-[19px] font-semibold text-white">{name}</div>
      </div>
      <Image
        src={profilePic}
        alt="Profile"
        width={40} 
        height={40}
        className="rounded-full"
      />
    </div>
  );
};

export default Greeting;
