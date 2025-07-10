import Image from 'next/image'
import React from 'react'
import "./section1.css";

const Section2 = () => {
  return (
    <>
        <div className="flex flex-col  w-full items-center">
      
      {/* Left text section */}
      <div className="mr-0 text-center  flex flex-col justify-center items-center overflow-hidden text-responsive">
        <div className="mt-3">
          <h1 className="h1 section1-h1 section2-h1">
            Seamless, Body-Mind-Emotional <br className="break-line" /> Support for Your Patients
          </h1>
        </div>
        <div
          id="section2-subtext"
          className="flex flex-col  justify-center items-center gap-0"
        >
          <p className="lead section1-p my-3">
            Empower your patients experience <br /> with Your Clinic Companion
          </p>
          <button className="custom-btn section2-btn">
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
      <div className="flex flex-col">
        <div className="text-center text-white overflow-hidden">
          <Image
            id="section2-img"
            src="/images/section-2.png"
            alt="Appointment"
            width={600}
            height={400}
            className="img-fluid"
          />
          <Image
            id="section2-img-mobile"
            src="/images/section-2-mobile.png"
            alt="Appointment"
            width={600}
            height={400}
            className="img-fluid"
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default Section2
