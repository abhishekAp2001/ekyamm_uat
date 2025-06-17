import Image from 'next/image'
import React from 'react'

const Dashboard_card = () => {
  const clinicStats = [
  {
    id: 1,
    icon: "/images/active-clinics.png",
    count: 25,
    label: "Active Clinics",
  },
  {
    id: 2,
    icon: "/images/inactive clinics.png",
    count: 16,
    label: "Inactive Clinics",
  },
  {
    id: 3,
    icon: "/images/num-of-eads.png",
    count: 36,
    label: "No. of Leads",
  },
  // Add more items as needed...
];

  return (
    <>
      {clinicStats.map((stat) => (
    <div
      key={stat.id}
      className="mt-[8.49px] py-2 px-3 bg-[#FFFFFF80] border border-[#FFFFFF33] rounded-[10px] w-100 h-20 flex flex-col items-center"
    >
      <div className="flex items-center gap-[2.5px]">
        <Image
          src={stat.icon}
          width={28}
          height={30}
          className="w-[28px]"
          alt={stat.label.toLowerCase().replace(/\s+/g, "-")}
        />
        <strong className="text-2xl text-black font-[600]">{stat.count}</strong>
      </div>
      <div>
        <span className="text-[12px] text-gray-500 pt-2">{stat.label}</span>
      </div>
    </div>
  ))}

      </>
  )
}

export default Dashboard_card
