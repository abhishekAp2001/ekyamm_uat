"use client"
import Image from 'next/image'
import React, {useRef } from 'react'
import "./section1.css";
import Contact_Form from '../Contact_Form/Contact_Form';

const Section =  ({ onStartClick }) => {
   const formRef = useRef();

  const handleButtonClick = () => {
    formRef.current?.openForm();
  };
  return (
    <>
    <div className="flex flex-col-reverse md:flex-row  w-full items-center">
      <div className="text-center text-white overflow-hidden md:ml-10 md:w-[47%] ">
        <Image
          src="/images/patient-doctor.webp"
          alt="Patient Doctor"
          width={600}
          height={400}
          className="img-fluid w-full h-auto"
        />
      </div>
      <div className="overflow-hidden text-responsive text-center md:text-start  md:w-[53%] md:pr-10 md:mr-5">
        <div className="my-3">
          <h1 className="h1 section1-h1">
            Patient Care with Mind-Body-Emotional Balance
          </h1>
          <p className="lead section1-p my-3">
            Ekyamm empowers your treatment plans by seamlessly integrating emotional well-being support into the treatment journey.
          </p>
        </div>
        <button className="cursor-pointer custom-btn m-auto md:ml-0 brand-btn schedule-btn"  onClick={onStartClick}>
          Start Now{" "}
          <Image
            src="/images/Arrow.svg"
            alt=""
            width={20}
            height={20}
          />
        </button>
         {/* <Contact_Form ref={formRef} /> */}
      </div>
    </div>
    </>
  )
}

export default Section
