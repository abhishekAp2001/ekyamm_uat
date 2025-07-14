"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import "./request-account-delete-success.css";
import Contact_Form from "@/components/sales/Contact_Form/Contact_Form";
import { getCookie } from "cookies-next";
 
const Page =({ onStartClick }) => {
  const formRef = useRef();
  
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
    const currentYear = new Date().getFullYear();
 
  // Check cookie and redirect if missing
  useEffect(() => {
    const userEmail = getCookie("user_email")
    if (!userEmail) {
      router.push('/');
    } else {
      setEmail(userEmail);
    }
  }, [router]);
 
  // Detect mobile
  // const isMobile = () => {
  //   if (typeof window === 'undefined') return false;
  //   const ua = navigator.userAgent || navigator.vendor || window.opera;
  //   return /android|iphone|ipad|iPod|iemobile|blackberry|bada|windows phone|webos|opera mini|mobile/i.test(ua)
  //          || window.innerWidth <= 767;
  // };
 
  // Handle Chat Now / Contact Us
      const [isMobile, setIsMobile] = useState(false);
    
  
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 767);
      checkMobile(); 
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);
  
      const handleButtonClick = () => {
        if (isMobile) {
          window.open("https://api.whatsapp.com/send/?phone=9920934198&text&type=phone_number&app_absent=0", "_blank");
        } else {
          formRef.current?.openForm();
        }
      };
      
        useEffect(() => {
          if (typeof navigator !== "undefined" && typeof window !== "undefined") {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isiOS && isSafari) {
              const preventZoom = (e) => e.preventDefault();
              document.addEventListener("gesturestart", preventZoom);
              return () => document.removeEventListener("gesturestart", preventZoom);
            }
          }
        }, []);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          rel="icon"
          href="/images/logo-circle-hands.svg"
          type="image/png"
        />
        <title>Delete Account Request Successful | Ekyamm</title>
      </Head>
 
      {/* Overlay */}
      {isContactFormOpen && (
        <div className="overlay" onClick={() => setIsContactFormOpen(false)} />
      )}
 
      <div id="overlay"></div>
 
      <div class="overlay"></div>
      {/* Navbar */}
      {/* <Navbar /> */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md py-2 md:py-5 px-[17px] md:px-[6%] flex flex-col ">
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
          {/* <ul id="menu-desktop"  className="hidden md:flex list-none flex-row m-0 p-0">
            <li className="mr-[35px] font-light text-[18px] leading-none">
              <a href="./mh-practitioner" className="no-underline text-inherit text-[16px]">
                MH Practitioner
              </a>
            </li>
            <li className="mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]">
              <a href="./" className="no-underline text-inherit text-[16px]">
                Fertility
              </a>
            </li>
          </ul> */}
 
          {/* Desktop buttons */}
          <button id="contactUs" className="hidden md:block bg-[#776EA5] text-white border-none px-2 py-2 rounded-[11px] font-quicksand font-medium" onClick={handleButtonClick}>
            Contact Us
          </button>
          <button id="chatNow" className=" md:hidden bg-[#776EA5] text-white border-none px-2 py-1 rounded-[11px] font-quicksand font-medium text-[12px] ml-2"
          onClick={handleButtonClick}>
            Chat Now
          </button>
        </div>
      </div>
 
      {/* Mobile Menu */}
      {/* <ul id="menu-mobile" className="flex md:hidden list-none flex-row p-0 px-[2.5%]">
        <li className="mr-[35px] font-light text-[18px] leading-none">
          <a href="/mh-practitioner" className="no-underline text-inherit text-[14px]">
            MH Practitioner
          </a>
        </li>
        <li className="mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]">
          <a href="./" className="no-underline text-inherit text-[14px]">
            Fertility
          </a>
        </li>
      </ul> */}
 
     
    </div>
 
      {/* Header */}
      <section id="header-section">
        <h1>Delete Account Request</h1>
        <span></span>
      </section>
 
      {/* Success Message */}
      <section id="delete-account-info">
        <p className="flex flex-col justify-center items-center">
       
          <p className="flex items-center">
             <Image
                  src="/images/green_check.png"
                  width={15}
                  height={15}
                  alt="Call"
                  className="w-5 md:w-[22px]"
                />
          &nbsp; Your request has successfully been received.</p>
          An email confirmation has been send to your registered email id{" "}
          <b>{email}</b>
        </p>
      </section>
 
      {/* Footer */}
      {/* <Footer /> */}
       <footer style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
      <section className="flex justify-between items-center md:flex-row md:justify-between md:px-10 py-4">
        {/* Logo */}
        <Image
          src="/images/ekyamm.png"
          alt="Company Logo"
          width={200}
          height={60}
          className="logo ekyamm-logo w-[108px] h-auto md:w-[250px]"
        />
 
        {/* Store buttons */}
        <div id="store" className="flex gap-2 md:mt-0">
          <Link
            href="https://play.google.com/store/apps/details?id=com.ekyamm.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/Play-store.png"
              alt="Play Store"
              width={110}
              height={50}
              className="logo w-auto h-[41px] md:w-full md:h-auto"
            />
          </Link>
        </div>
      </section>
 
      {/* Copyright */}
      <div
        id="copyright"
        className="text-center text-sm py-2"
      >
        Copyright © {currentYear}&nbsp;Radicle Minds India Private Limited. All rights reserved. |&nbsp;
        <Link
          href="/privacy-policy"
          className='hover:underline privacy'
          style={{ color: "#6d6a5d", fontWeight: 500, cursor: "pointer" }}
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
 
      {/* Contact Form Popup */}
<Contact_Form  ref={formRef} mobile_field={false}/>
    </>
  );
};
 
export default Page;