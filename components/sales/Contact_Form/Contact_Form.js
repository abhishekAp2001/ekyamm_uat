"use client"
import Image from "next/image";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./contact-form.css";
import { X } from "lucide-react";
import Link from "next/link";

const Contact_Form = forwardRef((props,ref) => {
  const { mobile_field = true } = props;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
  }));

  const closeForm = () => {
    setIsFormOpen(false);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          message: "",
        })
        setErrors({
          email: '',
          mobile: '',
          name: '',
          message: '',
        });setIsFormOpen(false);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          message: "",
        })
        setErrors({
          email: '',
          mobile: '',
          name: '',
          message: '',
        });
  }

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
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      mobile: "",
      message: "",
    })
    const [errors, setErrors] = useState({
      email: '',
      mobile: '',
      name: '',
      message: '',
    });
    const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
    const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);
  
    const isFormValid = () => {
      let valid = true;
      if(!formData.name){
        valid = false;
        setErrors({...errors,name:'Name is required'})
      }
      if(!formData.message){
      valid = false;
      setErrors({...errors,message:'Message is required'})
    }
      if (!isEmailValid(formData.email)) {
        valid = false;
        setErrors({ ...errors, email: 'Invalid Email' });
      }
      if (!isMobileValid(formData.mobile)) {
        valid = false;
        setErrors({ ...errors, mobile: 'Invalid Mobile Number' });
      }
      return valid;
    }
    const handleContactFormSubmit = () => {
      if (isFormValid()) {
        setIsFormOpen(false);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          message: "",
        })
        setErrors({
          email: '',
          mobile: '',
          name: '',
          message: '',
        });
      }
    }
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
          <h1 className="text-xl font-semibold ">Get In Touch!</h1>
          <label>
            <b>Name</b> <span className="compulsory-fields">*</span>
          </label>
          <input
            className="w-full border p-2 mb-2"
            type="text"
            placeholder="Enter your Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData,
              name: e.target.value
            })}
            required
          />
          {errors.name && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errors.name}</p>
          )}
          <label>
            <b>Email</b> <span className="compulsory-fields">*</span>
          </label>
          <input
          className="w-full border p-2 mb-2"
            value={formData.email}
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase();
              setFormData(
              { ...formData, email: e.target.value.toLocaleLowerCase() }
            )}}
            type="email"
            placeholder="Enter your Email"
            name="email"
            required
          />
          {errors.email && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errors.email}</p>
          )}
          {
            mobile_field && (
              <div>
            <label>
            <b>Mobile</b> <span className="compulsory-fields">*</span>
          </label>
          <input
  className="w-full border p-2 mb-2"
  value={formData.mobile}
  onChange={(e) =>
    setFormData({
      ...formData,
      mobile: e.target.value.replace(/\D/g, '').slice(0, 10)
    })
  }
  type="tel"
  placeholder="Enter your Mobile"
  name="number"
  required
  inputMode="numeric"
/>
          {errors.mobile && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errors.mobile}</p>
          )}
          </div>
            )
          }
          <label>
            <b>Message</b>
          </label>
          <textarea
          className="w-full border p-2"
            value={formData.message}
            onChange={(e) => setFormData({
              ...formData, message: e.target.value
            })}
            name="msg"
            placeholder="Enter your message"
            rows="4"
            required
          ></textarea>
          {errors.message && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errors.message}</p>
          )}
          <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded"
          onClick={()=>{handleContactFormSubmit()}}>
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
