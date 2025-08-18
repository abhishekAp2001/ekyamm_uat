"use client";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./contact-form.css";
import { X } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const Contact_Form = forwardRef((props, ref) => {
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
    });
    setErrors({
      email: "",
      mobile: "",
      name: "",
      message: "",
    });
  };

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
    const isiOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isiOS && isSafari) {
      const preventZoom = (e) => e.preventDefault();
      document.addEventListener("gesturestart", preventZoom);
      return () => document.removeEventListener("gesturestart", preventZoom);
    }
  }, []);

  // ------------------- FORM STATE -------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    name: "",
    message: "",
  });

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isMobileValid = (mobile) => /^\d{10}$/.test(mobile);

  // ✅ Validate a single field
  const validateField = (field, value) => {
    let message = "";
    if (field === "name" && !value.trim()) {
      message = "Name is required";
    }
    if (field === "email" && !isEmailValid(value)) {
      message = "Invalid Email";
    }
    if (field === "mobile" && !isMobileValid(value)) {
      message = "Invalid Mobile Number";
    }
    if (field === "message" && !value.trim()) {
      message = "Message is required";
    }
    return message;
  };

  // ✅ Validate all fields on submit
  const isFormValid = () => {
    let newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      mobile: validateField("mobile", formData.mobile),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  // ✅ On input change: update state + validate field immediately
  const handleChange = (field, value) => {
    let newFormData = { ...formData, [field]: value };

    if (field === "mobile") {
      newFormData.mobile = value.replace(/\D/g, "").slice(0, 10);
    }
    if (field === "email") {
      newFormData.email = value.toLowerCase();
    }

    setFormData(newFormData);

    // live validation
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, newFormData[field]),
    }));
  };

  // ------------------- SUBMIT HANDLER -------------------
  const handleContactFormSubmit = async () => {
    try {
      if (isFormValid()) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v2/sales/enquiry`,
          {
            name: formData?.name,
            email: formData?.email,
            mobile: formData?.mobile,
            message: formData?.message,
          }
        );
        if (response?.data?.success === true) {
          showSuccessToast(
            response?.data?.message || "Form submitted successfully"
          );
          closeForm();
        }
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      if (error?.status == 500)
        return showErrorToast("Something Went Wrong !!!");
      showErrorToast(
        error.response?.data?.error?.message || "Failed to send email"
      );
    }
  };

  // ------------------- UI -------------------
  return (
    <>
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

          {/* Name */}
          <label>
            <b>Name</b> <span className="compulsory-fields">*</span>
          </label>
          <input
            className="w-full border p-2 mb-2"
            type="text"
            placeholder="Enter your Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "14px" }}>{errors.name}</p>
          )}

          {/* Email */}
          <label>
            <b>Email</b> <span className="compulsory-fields">*</span>
          </label>
          <input
            className="w-full border p-2 mb-2"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            type="email"
            placeholder="Enter your Email"
            name="email"
            required
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>
          )}

          {/* Mobile */}
          {mobile_field && (
            <div>
              <label>
                <b>Mobile</b> <span className="compulsory-fields">*</span>
              </label>
              <input
                className="w-full border p-2 mb-2"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                type="tel"
                placeholder="Enter your Mobile"
                name="number"
                required
                inputMode="numeric"
              />
              {errors.mobile && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {errors.mobile}
                </p>
              )}
            </div>
          )}

          {/* Message */}
          <label>
            <b>Message</b>
            <span className="compulsory-fields">*</span>
          </label>
          <textarea
            className="w-full border p-2"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            name="msg"
            placeholder="Enter your message"
            rows="4"
            required
          ></textarea>
          {errors.message && (
            <p style={{ color: "red", fontSize: "14px" }}>{errors.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn w-full bg-blue-600 text-white py-2 rounded cursor-pointer"
            onClick={() => {
              handleContactFormSubmit();
            }}
          >
            Submit
          </button>

          {/* Footer */}
          <div align="center" id="form-footer" className="mt-4 text-sm">
            For all inquiries, please feel free to reach out at:
            <div className="flex items-center justify-center gap-1 mt-1">
              <Image
                src="/images/Group 924.png"
                alt="icon1"
                width={15}
                height={15}
              />
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

Contact_Form.displayName = "Contact_Form";
export default Contact_Form;
