import Image from 'next/image'
import React, { useRef } from 'react'
import "../Section1/section1.css";
import "./section2.css";

const Section2 = ({ onStartClick }) => {
   const formRef = useRef();
  
    const handleButtonClick = () => {
      formRef.current?.openForm();
    };
  return (
    <>
      <div className="flex flex-col w-full items-center">
      
      {/* Left text section */}
      <div className="mr-0 md:mr-3 text-center md:text-start flex flex-col justify-center items-center overflow-hidden text-responsive">
        <div className="mt-3">
          <h1 className="h1 section1-h1 section2-h1 text-center">
            Seamless, Body-Mind-Emotional <br className="break-line" /> Support for Your Patients
          </h1>
        </div>
        <div
          id="section2-subtext"
          className="flex flex-col md:hidden justify-center items-center gap-0 md:gap-0"
        >
          <p className="lead section1-p mt-3">
            Empower your patients experience <br /> with Your Clinic Companion
          </p>
          <button className="custom-btn section2-btn"
          onClick={onStartClick}>
            Partner Now{" "}
            <Image
              src="/images/Arrow.svg"
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* Right images & extra text */}
      <div className="flex flex-col md:flex-row w-full md:gap-7">
        <div className="text-center text-white overflow-hidden md:w-[55%]">
          <Image
            id="section2-img"
            src="/images/section-2.webp"
            alt="Appointment"
            width={600}
            height={400}
            className="img-fluid w-full"
          />
          <Image
            id="section2-img-mobile"
            src="/images/section-2-mobile.webp"
            alt="Appointment"
            width={600}
            height={400}
            className="img-fluid w-full"
          />
        </div>
        <div
          id="section2-subtext-desktop"
          className="flex flex-col justify-center md:w-[4%5]"
        >
          <p className="lead section1-p">
            Empower your patients experience <br /> with Your Clinic Companion
          </p>
          <button className="custom-btn section2-btn brand-btn schedule-btn"  onClick={onStartClick}>
            Partner Now{" "}
            <Image
              src="/images/Arrow.svg"
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Section2
