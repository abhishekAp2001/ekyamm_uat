import Image from 'next/image'
import React, { useRef } from 'react'
import "../Section1/section1.css";
import "./section4.css";

const Section4 = ({ onStartClick }) => {
  const formRef = useRef();
    
      const handleButtonClick = () => {
        formRef.current?.openForm();
      };
  return (
    <>
   <div className="flex flex-row w-full items-center">
      {/* Text container */}
      <div
        id="section5-text-container"
        className="mx-0 px-0 mr-0  ml-0  text-center md:text-start overflow-hidden text-responsive md:w-[58%]"
      >
        {/* Desktop content (md and up) */}
        {/* <div className="my-3 hidden md:block">
          <h1 className="h1 section1-h1 section5-h1">
            Fertility Care That Nurtures <br /> Mind and Body
          </h1>
          <p className="lead section1-p">
            Join top fertility and gynec centers partnering with Ekyamm <br /> to provide seamless mental health support.
          </p>
        </div> */}

        {/* Mobile content (below md) */}
        <div className="my-3 block">
          <h1 className="h1 section1-h1 section5-h1">
            Fertility Care That Nurtures Mind and Body
          </h1>
          <p className="lead section1-p my-2">
            Join top fertility and gynec centers partnering with Ekyamm to provide seamless mental health support.
          </p>
        </div>

        <button className="custom-btn m-auto md:ml-0" onClick={onStartClick}>
          Redefine Care Today !{" "}
          <Image
            src="/images/Arrow.svg"
            alt=""
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Image container */}
      <div
        id="section5-img-container"
        className="mr-0 pr-0 text-center text-white overflow-hidden md:w-[42%] flex md:justify-end items-end">
        <Image
          id="section5-img"
          className="custom-img img-fluid md:w-[280px] h-auto"
          src="/images/physician-medical-robe.webp"
          alt="Patient Doctor"
          width={400}
          height={400}
        />
      </div>
    </div>
    </>
  )
}

export default Section4
