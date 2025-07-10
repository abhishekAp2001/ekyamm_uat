import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md py-2 px-[17px] flex flex-col max-w-[576px] mx-auto">
      <div className="flex justify-between items-center">
        {/* Company Logo */}
        <Image
          src="/images/ekyamm-white.jpg"
          alt="Company Logo"
          width={250}
          height={60}
          className="cursor-pointer w-[142px] h-auto"
        />

        {/* Right side */}
        <div className="flex items-center nav-right">
          {/* Desktop Menu */}
          <ul id="menu-desktop"  className="hidden md:flex list-none flex-row m-0 p-0">
            <li className="mr-[35px] font-light text-[18px] leading-none">
              <a href="mh-practitioner.html" className="no-underline text-inherit text-[16px]">
                MH Practitioner
              </a>
            </li>
            <li className="mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]">
              <a href="fertility.html" className="no-underline text-inherit text-[16px]">
                Fertility
              </a>
            </li>
          </ul>

          {/* Desktop buttons */}
          <button id="contactUs" className="hidden md:block bg-[#776EA5] text-white border-none px-4 py-2 rounded-[11px] font-quicksand font-medium">
            Contact Us
          </button>
          <button id="chatNow" className=" md:hidden bg-[#776EA5] text-white border-none px-2 py-1 rounded-[11px] font-quicksand font-medium text-[12px] ml-2">
            Chat Now
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul id="menu-mobile" className="flex md:hidden list-none flex-row p-0 px-[2.5%]">
        <li className="mr-[35px] font-light text-[18px] leading-none">
          <a href="mh-practitioner.html" className="no-underline text-inherit text-[14px]">
            MH Practitioner
          </a>
        </li>
        <li className="mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]">
          <a href="fertility.html" className="no-underline text-inherit text-[14px]">
            Fertility
          </a>
        </li>
      </ul>

     
    </div>
    </>
  )
}

export default Navbar
