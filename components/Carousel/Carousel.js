"use client";
import Image from "next/image";
import React, { useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const images = [
  {
    id: 1,
    content: (
      <section className="hero-section flex flex-col-reverse md:flex-row justify-center items-start bg-transparent">
        <div className="image-column hand_img">
          <Image
            src="/images/hand&UIComp.webp"
            alt="Phone in Hand"
            width={788}
            height={500}
            className="w-[788px] hidden md:flex"
          />
          <Image
            src="/images/handUI.webp"
            alt="Phone in Hand"
            width={788}
            height={500}
            className="w-[788px] md:hidden relative bottom-[-32px] left-[-23px]"
          />
        </div>

        <div className="section1-leftcol">
          <div className="image-column flex flex-col w-full">
            <Image
              src="/images/Ekyamm-Awardsgs.webp"
              alt="Ekyamm Awards"
              width={550}
              height={300}
              className="w-full ekyamm_awards"
            />
            <button
              id="schedule-demo2"
              className="schedule-btn md:mt-4 flex items-center gap-2 text-[24px] p-[10px]"
            >
              Schedule Demo
              <Image
                src="/images/red-arrow.svg"
                alt=""
                width={10}
                height={10}
                className="w-5"
              />
            </button>
          </div>
        </div>
      </section>
    ),
  },
  {
    id: 2,
    content: (
      <section className="hero-section flex flex-col-reverse md:flex-row items-center bg-transparent">
        <div className="hero-text-column max-w-lg p-4">
          <h1 className="text-3xl font-bold">
            <span className="brand-text">Enhance</span> the value of your clinic
          </h1>
          <p className="mt-2">
            <span className="brand-text brand-text-bold">Ekyamm</span> runs on
            International Standard security with AES-256 encryption for{" "}
            <span className="brand-text brand-text-bold">
              controlled and confidential data management
            </span>
          </p>
          <button className="brand-btn schedule-btn mt-4 flex items-center gap-2">
            Schedule Demo
            <Image src="/images/Arrow.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <div className="image-column mt-4 md:mt-0">
          <Image
            src="/images/heroMobile-3-screens.png"
            alt="Your Image"
            width={550}
            height={400}
          />
        </div>
      </section>
    ),
  },
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className="relative overflow-hidden" id="carousel1">
        {/* Slides */}
        {/* <div className="flex transition-transform duration-500"
           style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((item) => (
          <div key={item.id} className="flex-none w-full">
            {item.content}
          </div>
        ))}
      </div> */}
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex-none w-full",
                index === 1 && "md:pt-20",
                index === 1 && "md:pl-[48px]",
                activeIndex === index &&
                  index === 1 &&
                  "bg-[url('/images/2nd-carousel.jpg')] bg-cover bg-center" // 👈 second slide ka background color
              )}
            >
              {item.content}
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
          {images.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-[3px] w-[30px] rounded-full bg-gray-300",
                activeIndex === index && "bg-white"
              )}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Carousel;
