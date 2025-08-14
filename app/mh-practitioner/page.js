"use client";
import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../CSS/styles.css"
import "./mh-practitioner.css";
import Footer from "@/components/sales/Footer/Footer";
import Carousel from "@/components/Carousel/Carousel";

import { X } from "lucide-react";
const Page = () => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [winnerImageSrc, setWinnerImageSrc] = useState('/images/hand&UIComp.png');
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
  // Mobile detection
  useEffect(() => {
    const mobileCheck = () => {
      let check = false;
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          navigator.userAgent || navigator.vendor || window.opera
        ) ||
        window.innerWidth <= 767
      ) {
        check = true;
      }
      return check;
    };

    setIsMobile(mobileCheck());

    const handleResize = () => {
      setWinnerImageSrc(
        window.innerWidth <= 768 ? '/images/handUI.png' : '/images/hand&UIComp.png'
      );
      setIsMobile(mobileCheck());
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form handling
  const openForm = () => {
    setIsFormOpen(true);
  };

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

  const handleButtonClick = () => {
    if (isMobile) {
      window.open(
        "https://api.whatsapp.com/send/?phone=9920934198&text&type=phone_number&app_absent=0",
        "_blank"
      );
    } else {
      openForm();
    }
  };

  // Disable zoom on iOS Safari
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isiOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isiOS && isSafari) {
      document.addEventListener("gesturestart", (e) => e.preventDefault());
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
        <title>Ekyamm</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
      </Head>

      <div
        id="overlay"
        style={{ display: isFormOpen ? "block" : "none" }}
        onClick={closeForm}
      ></div>

      {/* Navbar */}
      <div className="fixed left-0 right-0 z-50 bg-white shadow-md py-2 md:py-5 px-[17px] md:px-[6%] flex flex-col navbar_sec">
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
            <ul
              id="menu-desktop"
              className="hidden md:flex list-none flex-row m-0 p-0"
            >
              <li  className="mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]">
                <a
                  href="./mh-practitioner"
                  className="no-underline text-inherit text-[16px]"
                >
                  MH Practitioner
                </a>
              </li>
              <li className="mr-[35px] font-normal text-[18px] leading-none">
                <a href="./" className="no-underline text-inherit text-[16px]">
                  Fertility
                </a>
              </li>
            </ul>

            {/* Desktop buttons */}
            <button
              id="contactUs"
              className="hidden md:block bg-[#776EA5] text-white border-none px-2 py-2 rounded-[11px] font-quicksand font-medium cursor-pointer" onClick={handleButtonClick}
            >
              Contact Us
            </button>
            <button
              id="chatNow"
              className=" md:hidden bg-[#776EA5] text-white border-none px-2 py-1 rounded-[11px] font-quicksand font-medium text-[12px] ml-2 cursor-pointer"
              onClick={handleButtonClick}>
              Chat Now
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <ul
          id="menu-mobile"
          className="flex md:hidden list-none flex-row p-0 px-[2.5%]"
        >
          <li  className="mr-[35px] font-bold text-[18px] leading-none text-[#776EA5]">
            <Link
              href="/mh-practitioner"
              className="no-underline text-inherit text-[14px]"
            >
              MH Practitioner
            </Link>
          </li>
          <li className="mr-[35px] font-light text-[18px] leading-none">
            <Link
              href="/"
              className="no-underline text-inherit text-[14px]"
            >
              Fertility
            </Link>
          </li>
        </ul>
      </div>
      <Carousel onStartClick={handleButtonClick} />
      {/* Carousel */}
      {/* <div id="carouselEkyammIndicators" className="carousel slide" style={{ zIndex: 6 }} data-ride="carousel" data-interval="400">
        <ol className="carousel-indicators" style={{ zIndex: 11 }}>
          <li data-target="#carouselEkyammIndicators" data-slide-to="0" className="active"></li>
          <li data-target="#carouselEkyammIndicators" data-slide-to="1"></li>
        </ol>
        <div className="carousel-inner">
          <div id="carousel1" className="carousel-item active">
            <section id="PSYSharkTankWinner" className="hero-section d-flex justify-content-center">
              <div id="winnerMobile" className="image-column">
                <Image
                  id="winnerMobileImg"
                  src={winnerImageSrc}
                  alt="Phone in Hand"
                  width={788}
                  height={500}
                />
              </div>
              <div className="section1-leftcol">
                <div id="winnerImg" className="image-column">
                  <Image
                    src="/images/Ekyamm-Awardsgs.png"
                    alt="Ekyamm Awards"
                    width={550}
                    height={300}
                  />
                  <button id="schedule-demo2" className="schedule-btn" onClick={handleButtonClick}>
                    Schedule Demo
                    <Image src="/images/red-arrow.svg" alt="" width={20} height={20} />
                  </button>
                </div>
              </div>
            </section>
          </div>
          <div id="carousel2" className="carousel-item">
            <section id="introSection1" className="hero-section">
              <div className="hero-text-column">
                <h1>
                  <span className="brand-text">Enhance</span> the value of your clinic
                </h1>
                <p>
                  <span className="brand-text brand-text-bold">Ekyamm</span> runs on International
                  Standard security with AES-256 encryption for{' '}
                  <span className="brand-text brand-text-bold">
                    controlled and confidential data management
                  </span>
                </p>
                <button id="schedule-demo" className="brand-btn schedule-btn" onClick={handleButtonClick}>
                  Schedule Demo
                  <Image src="/images/Arrow.svg" alt="" width={20} height={20} />
                </button>
              </div>
              <div className="image-column">
                <Image
                  src="/images/heroMobile-3-screens.png"
                  alt="Your Image"
                  width={550}
                  height={400}
                />
              </div>
            </section>
          </div>
        </div>
      </div> */}

      <div className="relative overflow-hidden">
        {/* Slides */}
        {/* <div className="flex transition-transform duration-500"
           style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((item) => (
          <div key={item.id} className="flex-none w-full">
            {item.content}
          </div>
        ))}
      </div> */}

        {/* Indicators */}
        {/* <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
        {images.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full bg-gray-300",
              activeIndex === index && "bg-gray-800"
            )}
          />
        ))}
      </div> */}
      </div>

      {/* Know More Section */}
      <section className="knowMore-section">
        <div
          className="image-column"
          style={{ position: "relative", zIndex: 6 }}
        >
          <Image
            src="/images/Women-Section-2comp.webp"
            alt="Your Image"
            width={550}
            height={400}
          />
        </div>
        <div className="hero-text-column">
          <h1 className="fontW-H1 leading-[1.1] mb-2">
            Focus on <br />
            <span className="brand-text">helping patients</span>
          </h1>
          <p>Empower your patients experience with Your Clinic Companion</p>
          <div id="know-more">Know More</div>
          <div id="store-img-section" className="flex items-center gap-1">
            <div id="know-more" className="text-[#2f2f2f]">
              Know More
            </div>
            <Link
              href="https://play.google.com/store/apps/details?id=com.ekyamm.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/Play-store.png"
                alt="Play Store"
                width={120}
                height={41}
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
                width={120}
                height={41}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Secure Section */}
      <section className="secure-section bg-[#d4b0d1]">
        <div id="secure-section-part1">
          <div className="image-column2">
            <Image
              src="/images/Locker.webp"
              alt="Locker"
              width={200}
              height={200}
            />
          </div>
          <div className="hero-text-column">
            <h1 className="fontW-H1 leading-[1.1]">
              Authorised
              Private
              Secure
              Confidential
            </h1>
          </div>
        </div>
        <span>
          <p>Peace of Mind:</p>
          <p>
            <span id="section3-t1">
              Take Control of Your Clinic Data <br />
            </span>
            with International Standard AES-256 Encryption, stronger than a{" "}
            <span style={{ color: "rgba(59, 50, 107, 1)", fontWeight: 500 }}>
              Bank Locker
            </span>
          </p>
        </span>
      </section>

      {/* Prescription Section */}
      <section
        id="section4"
        className="prescription-section"
        style={{ backgroundColor: "rgba(239, 239, 239, 1)" }}
      >
        <div className="image-column">
          <Image
            src="/images/Prescriptions.webp"
            alt="Prescriptions"
            width={550}
            height={400}
          />
        </div>
        <div className="hero-text-column">
          <p>Upload or Create</p>
          <h1 className="leading-[1.1]">
            <span className="brand-text fontW-H1">Prescriptions</span>
          </h1>
          <p>in less than 30 seconds</p>
          <button
            className="brand-btn schedule-btn cursor-pointer"
            id="request-btn"
            onClick={handleButtonClick}
          >
            Request Invite
            <Image src="/images/Arrow.svg" alt="" width={20} height={20} />
          </button>
        </div>
      </section>

      {/* Join Network Section */}
      <section
        id="section5"
        className="prescription-section"
        style={{ backgroundColor: "rgba(240, 235, 232, 1)" }}
      >
        <div className="hero-text-column">
          <h1>
            <span className="brand-text fontW-H1">Make it bigger!</span>
          </h1>
          <p>
            Boost your Psychiatric Clinic Revenue by 2x to 6x Join Ekyamm&apos;s
            Psychiatric Provider Network
          </p>
          <button
            className="brand-btn schedule-btn cursor-pointer"
            style={{ marginTop: "10px" }}
            onClick={handleButtonClick}
          >
            Join Now
            <Image src="/images/Arrow.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <div className="image-column">
          <Image
            src="/images/Blocks.webp"
            alt="Your Image"
            width={550}
            height={400}
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Form Popup */}
      <div
        className="form-popup"
        id="contactUsForm"
        style={{ display: isFormOpen ? "block" : "none" }}
      >
        <div id="close-contactForm" align="right" onClick={closeForm}>
          <X width={23} height={23} />
        </div>
        <div className="form-container">
          <h1>Get In Touch!</h1>
          <label htmlFor="name">
            <b>Name</b> <span className="compulsory-fields">*</span>
          </label>
          <input
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
          <label htmlFor="email">
            <b>Email</b> <span className="compulsory-fields">*</span>
          </label>
          <input
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
          <label htmlFor="number">
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
          <label htmlFor="msg">
            <b>Message</b><span className="compulsory-fields">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({
              ...formData, message: e.target.value
            })}
            name="msg"
            id="msg"
            placeholder="Enter your message"
            cols="30"
            rows="5"
            required
          ></textarea>
          {errors.message && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errors.message}</p>
          )}
          <button type="submit" className="btn"
            onClick={() => { handleContactFormSubmit() }}>
            Submit
          </button>
          <div align="center" id="form-footer">
            For all inquiries, please feel free to reach out at:
            <br />
            <div
              align="center"
              className="flex items-center justify-center m-auto gap-1"
            >
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
              >
                +91 99209 34198
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
