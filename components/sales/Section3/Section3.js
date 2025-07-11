import Image from 'next/image'
import React from 'react'
import "../Section1/section1.css";
import "./section3.css";




const Section3 = () => {
  return (
    <>
   <div className="flex flex-col w-full items-center">
      
      {/* Left side: text + image */}
      <div className="mr-0  text-center md:text-start flex flex-col justify-center items-center overflow-hidden text-responsive">
        <div className="mt-0 flex flex-col px-0">
          
          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/images/heart-plus-mobile.png"
              alt="Heart plus"
              width={300}
              height={300}
              className="img-fluid"
            />
          </div>
          
          {/* List */}
          <div align="left" className="h1 section1-h1 w-full">
            <ul id="section3-list">
              <li className="section3-li">Zero Cost to the Clinic</li>
              <li className="section3-li">No Extra Infrastructure or Staff Required</li>
              <li className="section3-li">Enhances Your Clinical Outcomes</li>
              <li className="section3-li">Boosts Patient Satisfaction & Trust</li>
            </ul>
          </div>
        </div>

        {/* Subtext */}
        <div id="section3-subtext" className="flex justify-center text-center">
          <p className="lead section1-p my-6">
            We <span id="custom-bold">integrate directly into your patient care workflow,</span> offering professional{" "}
            <span id="custom-color">mental health interventions</span> without disrupting your existing systems.
          </p>
        </div>
      </div>

      {/* Right side: button */}
      <div className="text-center text-white overflow-hidden ">
        <button className="custom-btn section2-btn my-4 mb-5">
          Get Ekyamm for your Clinic{" "}
          <Image
            src="/images/Arrow.svg"
            alt=""
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
    </>
  )
}

export default Section3
