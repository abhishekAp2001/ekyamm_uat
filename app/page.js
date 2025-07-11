import Navbar from '@/components/sales/Navbar/Navbar'
import Section from '@/components/sales/Section1/Section'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import React from 'react'
import "./CSS/styles.css"
import Section2 from '@/components/sales/Section2/Section2'
import Section3 from '@/components/sales/Section3/Section3'
import Section4 from '@/components/sales/Section4/Section4'
import Footer from '@/components/sales/Footer/Footer'
import Contact_Form from '@/components/sales/Contact_Form/Contact_Form'
 
 
 
const page = () => {
  return (
   <div className="flex flex-col h-screen bg-gradient-to-b space-y-4 from-[#DFDAFB] to-[#F9CCC5] absolute left-0 right-0 max-w-[576px] mx-auto">
      <Head>
        <title>Ekyamm</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Link rel="icon" href="/images/logo-circle-hands.svg" type="image/png" />
        {/* If you **really** need Bootstrap, keep this: */}
        {/* Or remove if you use Tailwind */}
        {/* <Link rel="stylesheet" href="/styles.css" /> */}
      </Head>
 
      <div id="overlay"></div>
 
      {/* Navbar placeholder */}
      <div id="navbar-placeholder" style={{ padding: 0, margin: 0 }}></div>
      <Navbar/>
      {/* Sections */}
      <div id="section1-placeholder" className='m-0' style={{ backgroundColor: "#B0A4F5" }}>
      <Section/>
      </div>
      <div id="section2-placeholder"  className='m-0' style={{ backgroundColor: "#D9D9D9" }}>
        <Section2/>
      </div>
      <div id="section3-placeholder"  className='pb-10 m-0' style={{ backgroundColor: "#E4B4AE" }}>
        <Section3/>
      </div>
      {/* <div id="section4-placeholder"></div> */}
      <div id="section5-placeholder" className='m-0' style={{ backgroundColor: "#EFEFEF" }}>
        <Section4/>
      </div>
 
      {/* Footer */}
      <div id="footer-placeholder">
        <Footer/>
      </div>
 
      {/* Contact form */}
      <div id="contact-form-placeholder" className='m-0'>
       <Contact_Form/>
      </div>
 
    </div>
  )
}
 
export default page