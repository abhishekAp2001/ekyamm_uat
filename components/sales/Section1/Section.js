import Image from 'next/image'
import React from 'react'
import "./section1.css";




const Section = () => {
  return (
    <>
    <div className="flex flex-col-reverse  w-full items-center">
      <div className="text-center text-white overflow-hidden ml-0 md:ml-5 mr-0 md:mr-3">
        <Image
          src="/images/patient-doctor.png"
          alt="Patient Doctor"
          width={600}
          height={400}
          className="img-fluid"
        />
      </div>
      <div className="overflow-hidden text-responsive text-center mr-0 pr-0 ">
        <div className="my-3">
          <h1 className="h1 section1-h1">
            Patient Care with Mind-Body-Emotional Balance
          </h1>
          <p className="lead section1-p my-3 md:px-[106px]">
            Ekyamm empowers your treatment plans by seamlessly integrating emotional well-being support into the treatment journey.
          </p>
        </div>
        <button className="custom-btn">
          Start Now{" "}
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

export default Section
