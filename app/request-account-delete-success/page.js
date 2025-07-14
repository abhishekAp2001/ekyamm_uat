"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import Cookies from 'js-cookie';

import Navbar from "@/components/sales/Navbar/Navbar";
import "./request-account-delete.css";
import { CookiesNextProvider } from "cookies-next";
import Footer from "@/components/sales/Footer/Footer";
import { CircleCheck } from "lucide-react";

const Page = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Check cookie and redirect if missing
  // useEffect(() => {
  //   const userEmail = CookiesNextProvider.get('user_email');
  //   if (!userEmail) {
  //     router.push('/');
  //   } else {
  //     setEmail(userEmail);
  //   }
  // }, [router]);

  // Detect mobile
  // const isMobile = () => {
  //   if (typeof window === 'undefined') return false;
  //   const ua = navigator.userAgent || navigator.vendor || window.opera;
  //   return /android|iphone|ipad|iPod|iemobile|blackberry|bada|windows phone|webos|opera mini|mobile/i.test(ua)
  //          || window.innerWidth <= 767;
  // };

  // Handle Chat Now / Contact Us
  const handleContactClick = () => {
    if (isMobile()) {
      window.open("https://api.whatsapp.com/send/?phone=9326780323", "_blank");
    } else {
      setIsContactFormOpen(true);
    }
  };

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
      <Navbar />

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
          An email confirmation has been send to your registered email id&apos&apos&apos{" "}
          <b>{email}</b>
        </p>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Form Popup */}
      {isContactFormOpen && (
        <div className="form-popup">
          <div
            id="close-contactForm"
            align="right"
            onClick={() => setIsContactFormOpen(false)}
          >
            <Image src="/images/Close.svg" width={23} height={23} alt="Close" />
          </div>
          <form className="form-container">
            <h1>Get In Touch!</h1>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              required
              className="form-control mb-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              required
              className="form-control mb-2"
            />
            <textarea
              name="msg"
              rows="4"
              placeholder="Enter your message"
              required
              className="form-control mb-2"
            />
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
            <div align="center" className="mt-2">
              For inquiries, contact:
              <div className="d-flex align-items-center justify-content-center mt-1">
                <Image
                  src="/images/Call.svg"
                  width={15}
                  height={15}
                  alt="Call"
                />
                &nbsp;
                <a
                  href="https://api.whatsapp.com/send/?phone=9326780323"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 93267 80323
                </a>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Page;
