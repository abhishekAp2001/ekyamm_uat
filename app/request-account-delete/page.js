"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Footer from "@/components/sales/Footer/Footer";
import "./request-account-delete.css";
import Navbar from "@/components/sales/Navbar/Navbar";

const Page = () => {
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showError, setShowError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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
      showErrorMsg("Please provide registered email id to request account delete");
      return;
    }
    if (!emailRegex.test(emailTrimmed)) {
      showErrorMsg("Please enter a valid email address");
      return;
    }

    try {
      setIsRequesting(true);
      const res = await fetch("https://dev.ekyamm.com/v1/user/requestAccountDelete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error?.message || "Unable to process request.");
      }

      document.cookie = `user_email=${encodeURIComponent(emailTrimmed)}`;
      window.location.href = "/request-account-delete-success"; // use Next.js page
    } catch (err) {
      showErrorMsg(err.message);
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

  return (
    <>
      <Head>
        <title>Delete Account Request | Ekyamm</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/images/logo-circle-hands.svg" type="image/png" />
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
        <Navbar/>
        <section id="header-section" className="text-center my-4">
          <h1>Delete Account Request</h1>
          <span></span>
        </section>

        <section
          id="delete-section"
          className=""
        >
          <div id="delete-account-info" className="pr-4"> 
            <p>Deleting your account will:</p>
            <ul>
              <li>Delete your data history</li>
              <li>Delete your account info</li>
              <li>Delete your access from all Ekyamm features</li>
            </ul>
          </div>
          <div id="email-container"  className="pl-4 text-center">
             <div>
            <p>Enter Your Registered Email</p>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        <Footer />
      </main>
    </>
  );
};

export default Page;
