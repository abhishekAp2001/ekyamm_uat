"use client"
import Navbar from '@/components/sales/Navbar/Navbar'
import Section from '@/components/sales/Section1/Section'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import "./CSS/styles.css"
import Section2 from '@/components/sales/Section2/Section2'
import Section3 from '@/components/sales/Section3/Section3'
import Section4 from '@/components/sales/Section4/Section4'
import Footer from '@/components/sales/Footer/Footer'
import Contact_Form from '@/components/sales/Contact_Form/Contact_Form'
 
 
 
const Page = () => {
     const formRef = useRef();
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

  return (
   <div className="flex flex-col w-full h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] ">
      <Head>
        <title>Ekyamm</title>
        <Link rel="icon" href="/images/logo-circle-hands.svg" type="image/png" />
        {/* If you **really** need Bootstrap, keep this: */}
        {/* Or remove if you use Tailwind */}
        {/* <Link rel="stylesheet" href="/styles.css" /> */}
      </Head>
 
    {/* <div
        id="overlay"
        style={{ display: isFormOpen ? "block" : "none" }}
        onClick={closeForm}
      ></div> */}
 
      {/* Navbar placeholder */}
      <div id="navbar-placeholder" style={{ padding: 0, margin: 0 }}></div>
      <Navbar onStartClick={handleButtonClick}/>
      {/* Sections */}
      <div id="section1-placeholder" className='m-0' style={{ backgroundColor: "#B0A4F5" }}>
      <Section onStartClick={handleButtonClick}/>
      </div>
      <div id="section2-placeholder"  className='m-0' style={{ backgroundColor: "#D9D9D9" }}>
        <Section2 onStartClick={handleButtonClick}/>
      </div>
      <div id="section3-placeholder"  className='pb-10 m-0 md:p-[24px_60px] ' style={{ backgroundColor: "#E4B4AE" }}>
        <Section3 onStartClick={handleButtonClick}/>
      </div>
      {/* <div id="section4-placeholder"></div> */}
      <div id="section5-placeholder" className='m-0 md:px-[6%]' style={{ backgroundColor: "#EFEFEF" }}>
        <Section4 onStartClick={handleButtonClick}/>
      </div>
 
      {/* Footer */}
      <div id="footer-placeholder">
        <Footer/>
      </div>
 
      {/* Contact form */}
      <div id="contact-form-placeholder" className='m-0'>
       <Contact_Form  ref={formRef}/>
      </div>
   
    </div>
  )
}
 
export default Page