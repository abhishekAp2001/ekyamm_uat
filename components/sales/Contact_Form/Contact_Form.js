"use client"
import Image from "next/image";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./contact-form.css";
import { X } from "lucide-react";
import Link from "next/link";

const Contact_Form = forwardRef((props, ref) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
  }));

  const closeForm = () => setIsFormOpen(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile(); // initial check
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
      setIsFormOpen(true);
    }
  };

  // Disable zoom on iOS Safari
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isiOS && isSafari) {
      const preventZoom = (e) => e.preventDefault();
      document.addEventListener("gesturestart", preventZoom);
      return () => document.removeEventListener("gesturestart", preventZoom);
    }
  }, []);

  return (
    <>
      {/* <button onClick={handleButtonClick} className="brand-btn schedule-btn">
        Contact Us
      </button> */}
       <div
        id="overlay"
        style={{ display: isFormOpen ? "block" : "none" }}
        onClick={closeForm}
      ></div>

      <div
        className="form-popup fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        style={{ display: isFormOpen ? "block" : "none" }}
      >
        <div className="form-container bg-white p-4 rounded-md relative max-w-md w-full">
          <div
            id="close-contactForm"
            className="absolute top-2 right-2 cursor-pointer"
            onClick={closeForm}
          >
            <X width={23} height={23} />
          </div>
          <h1 className="text-xl font-semibold mb-4">Get In Touch!</h1>
          <label>
            <b>Name</b> <span className="compulsory-fields">*</span>
          </label>
          <input type="text" placeholder="Enter your Name" name="name" required className="w-full border p-2 mb-2" />

          <label>
            <b>Email</b> <span className="compulsory-fields">*</span>
          </label>
          <input type="email" placeholder="Enter your Email" name="email" required className="w-full border p-2 mb-2" />

          <label>
            <b>Mobile</b> <span className="compulsory-fields">*</span>
          </label>
          <input type="number" placeholder="Enter your Mobile" name="number" required className="w-full border p-2 mb-2" />

          <label>
            <b>Message</b>
          </label>
          <textarea name="msg" placeholder="Enter your message" rows="4" required className="w-full border p-2 mb-4"></textarea>

          <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded">
            Submit
          </button>

          <div align="center" id="form-footer" className="mt-4 text-sm">
            For all inquiries, please feel free to reach out at:
            <div className="flex items-center justify-center gap-1 mt-1">
              <Image src="/images/Group 924.png" alt="icon1" width={15} height={15} />
              <Link
                href="https://api.whatsapp.com/send/?phone=9920934198&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                +91 99209 34198
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// add display name for better debugging in React DevTools
Contact_Form.displayName = "Contact_Form";

export default Contact_Form;
