import Image from 'next/image'
import React, { useRef } from 'react'
import "./navbar.css";
import Link from 'next/link';
 
const Navbar = ({onStartClick}) => {
  const formRef = useRef();
   
      const handleButtonClick = () => {
        formRef.current?.openForm();
      };
    const pathname = window.location.pathname
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md py-2 md:py-5 px-[17px] md:px-[6%] flex flex-col navbar_sec">
      <div className="flex justify-between items-center">
        {/* Company Logo */}
        <Link href='./'>
        <Image
          src="/images/ekyamm.png"
          alt="Company Logo"
          width={250}
          height={60}
          className="cursor-pointer max-w-[142px] h-auto md:max-w-[240px]"
        /></Link>
 
        {/* Right side */}
        <div className="flex items-center nav-right">
          {/* Desktop Menu */}
          <ul id="menu-desktop"  className="hidden md:flex list-none flex-row m-0 p-0">
            <li className="mr-[35px] font-normal text-[18px] leading-none">
              <a href="./mh-practitioner" className="no-underline text-inherit text-[16px]">
                MH Practitioner
              </a>
            </li>
            <li className={` ${pathname==='/'?'mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]':'mr-[35px] font-normal text-[18px] leading-none'}`}>
              <a href="./" className="no-underline text-inherit text-[16px]">
                Fertility
              </a>
            </li>
          </ul>
 
          {/* Desktop buttons */}
          <button id="contactUs" className="hidden md:block bg-[#776EA5] text-white border-none px-2 py-2 rounded-[11px] font-quicksand font-medium" onClick={onStartClick}>
            Contact Us
          </button>
          <button id="chatNow" className=" md:hidden bg-[#776EA5] text-white border-none px-2 py-1 rounded-[11px] font-quicksand font-medium text-[12px] ml-2"
          onClick={onStartClick}>
            Chat Now
          </button>
        </div>
      </div>
 
      {/* Mobile Menu */}
      <ul id="menu-mobile" className="flex md:hidden list-none flex-row p-0 px-[2.5%]">
        <li className="mr-[35px] font-normal text-[18px] leading-none">
          <a href="/mh-practitioner" className="no-underline text-inherit text-[14px]">
            MH Practitioner
          </a>
        </li>
        <li className={` ${pathname==='/'?'mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]':'mr-[35px] font-normal text-[18px] leading-none'}`}>
              <a href="./" className="no-underline text-inherit text-[16px]">
                Fertility
              </a>
            </li>
      </ul>
 
     
    </div>
    </>
  )
}
 
export default Navbar
 
 