"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import "../CSS/styles.css";
import "./request-account-delete.css";
import Contact_Form from "@/components/sales/Contact_Form/Contact_Form";
import Link from "next/link";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";

const Page = () => {
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showError, setShowError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth <= 767);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof window !== "undefined") {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isiOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isiOS && isSafari) {
        const preventZoom = (e) => e.preventDefault();
        document.addEventListener("gesturestart", preventZoom);
        return () => document.removeEventListener("gesturestart", preventZoom);
      }
    }
  }, []);

  const handleRequest = async () => {
    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      showErrorMsg(
        "Please provide registered email id to request account delete"
      );
      return;
    }
    if (!emailRegex.test(emailTrimmed)) {
      showErrorMsg("Please enter a valid email address");
      return;
    }

    try {
      setIsRequesting(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/auth/user/requestDelete`,
        {
          email: emailTrimmed,
        }
      );
      if (response?.data?.success) {
        setCookie("user_email", emailTrimmed);
        router.push("/request-account-delete-success");
      } else {
        showErrorToast("Failed to send mail");
      }
    } catch (err) {
      showErrorMsg(err.message);
      showErrorToast("Failed to send mail");
    } finally {
      setIsRequesting(false);
    }
  };

  const showErrorMsg = (msg) => {
    setErrorText(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const formRef = useRef();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleButtonClick = () => {
    if (isMobile) {
      window.open(
        "https://api.whatsapp.com/send/?phone=9920934198&text&type=phone_number&app_absent=0",
        "_blank"
      );
    } else {
      formRef.current?.openForm();
    }
  };

  const pathname = window.location.pathname

  return (
    <> 
      <Head>
        <title>Delete Account Request | Ekyamm</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          rel="icon"
          href="/images/logo-circle-hands.svg"
          type="image/png"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
      </Head>

      {/* Overlay when form is open */}
      {isFormOpen && (
        <div id="overlay" className="overlay" onClick={closeForm}></div>
      )}

      <main>
        <div id="overlay"></div>

        <div class="overlay"></div>
        <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md py-2 md:py-5 px-[17px] md:px-[6%] flex flex-col navbar_sec">
          <div className="flex justify-between items-center">
            {/* Company Logo */}
            <Link href="./">
              <Image
                src="/images/ekyamm.png"
                alt="Company Logo"
                width={250}
                height={60}
                className="cursor-pointer max-w-[142px] h-auto md:max-w-[240px]"
              />
            </Link>

            {/* Right side */}
            <div className="flex items-center nav-right">
              {/* Desktop Menu */}
              <ul
                id="menu-desktop"
                className="hidden md:flex list-none flex-row m-0 p-0"
              >
                <li className="mr-[35px] font-normal text-[18px] leading-none">
                  <a
                    href="./mh-practitioner"
                    className="no-underline text-inherit text-[16px]"
                  >
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
              <button
                id="contactUs"
                className="hidden md:block bg-[#776EA5] text-white border-none px-2 py-2 rounded-[11px] font-quicksand font-medium"
                onClick={handleButtonClick}
              >
                Contact Us
              </button>
              <button
                id="chatNow"
                className=" md:hidden bg-[#776EA5] text-white border-none px-2 py-1 rounded-[11px] font-quicksand font-medium text-[12px] ml-2"
                onClick={handleButtonClick}
              >
                Chat Now
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <ul
            id="menu-mobile"
            className="flex md:hidden list-none flex-row p-0 px-[2.5%]"
          >
            <li className="mr-[35px] font-normal text-[18px] leading-none">
              <a
                href="/mh-practitioner"
                className="no-underline text-inherit text-[14px]"
              >
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
        <section id="header-section" className="text-center my-4">
          <h1>Delete Account Request</h1>
          <span></span>
        </section>

        <section id="delete-section" className="">
          <div id="delete-account-info" className="pr-4">
            <p>Deleting your account will:</p>
            <ul>
              <li>Delete your data history</li>
              <li>Delete your account info</li>
              <li>Delete your access from all Ekyamm features</li>
            </ul>
          </div>
          <div id="email-container" className="pl-4 text-center">
            <div>
              <p>Enter Your Registered Email</p>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
                className="form-control mb-2"
              />
              <button
                onClick={handleRequest}
                className="btn btn-primary"
                disabled={isRequesting}
                id="request"
              >
                {isRequesting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Requesting...
                  </>
                ) : (
                  "Request"
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error popup */}
        {showError && (
          <div
            id="error_popup_box"
            className="alert alert-danger mt-3 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-exclamation-circle"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
            &nbsp; {errorText}
          </div>
        )}

        {/* Contact Us form */}
        {isFormOpen && (
          <div className="form-popup">
            <div align="right">
              <Image
                src="/images/Close.svg"
                width={23}
                height={23}
                alt="Close"
                onClick={closeForm}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form className="form-container">
              <h1>Get In Touch!</h1>
              <input
                type="text"
                placeholder="Enter your Name"
                name="name"
                required
                className="form-control mb-2"
              />
              <input
                type="email"
                placeholder="Enter your Email"
                name="email"
                required
                className="form-control mb-2"
              />
              <textarea
                placeholder="Enter your message"
                name="msg"
                rows="4"
                required
                className="form-control mb-2"
              />
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
              <div align="center" className="mt-2">
                For all inquiries, please reach out:
                <div className="d-flex align-items-center justify-content-center mt-1">
                  <Image
                    src="/images/Call.svg"
                    width={15}
                    height={15}
                    alt="Call"
                  />
                  &nbsp;
                  <a
                    href="https://api.whatsapp.com/send/?phone=9326780323&text&type=phone_number&app_absent=0"
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
        <div id="contact-form-placeholder" className="m-0">
          <Contact_Form ref={formRef} />
        </div>
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
              <Link
                href="https://apps.apple.com/in/app/ekyamm-mh-clinic-companion/id6450462268"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/App-store.png"
                  alt="App Store"
                  width={110}
                  height={50}
                  className="logo w-auto h-[41px] md:w-full md:h-auto"
                />
              </Link>
            </div>
          </section>

          {/* Copyright */}
          <div id="copyright" className="text-center text-sm py-2">
            Copyright © {currentYear}&nbsp;Radicle Minds India Private Limited.
            All rights reserved. |&nbsp;
            <Link
              href="/privacy-policy"
              className="hover:underline privacy"
              style={{ color: "#6d6a5d", fontWeight: 500, cursor: "pointer" }}
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Page;
