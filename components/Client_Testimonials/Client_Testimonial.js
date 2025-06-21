import React from "react";
import Client_Header from "../Client_Header/Client_Header";
import Image from "next/image";

const Client_Testimonial = () => {
  return (
    <div
      className="bg-gradient-to-t from-[#fce8e5]  to-[#eeecfb]  h-full flex flex-col items-center"
      style={{ minHeight: "100vh" }}
    >
      <Client_Header />

      {/* Outer container */}
      <div className="w-full max-w-[360px] px-2.5 mx-auto flex flex-col  mt-4 h-full">
        {/* First Card */}
        <div className=" w-full h-[120px] bg-white rounded-[12px] mt-4 flex justify-between px-4 py-2 ">
          {/* Left side: Priya Kapoor + Verified + paragraph */}
          <div className="flex flex-col" style={{ width: "88%" }}>
            <div className="flex items-center mt-[12px] gap-2">
              <span
                style={{
                  height: "16px",
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  lineHeight: "16px",
                }}
              >
                Priya Kapoor
              </span>

              <span
                style={{
                  fontSize: "8px",
                  height: "16px",
                  borderRadius: "8px",
                  padding: "0 4px",
                  backgroundColor: "#F9CCC5",
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  lineHeight: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  minWidth: "38px",
                }}
              >
                Verified
              </span>
            </div>

            <p
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "12px",
                lineHeight: "14px",
                marginTop: "6px",
                overflow: "hidden",
                textOverflow: "ellipsis",

                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              Lorem Ipusum whatsa asjuda Lorem Ipusum whatsa asjudaLorem Ipusum
              whatsa asjudaLorem Ipusum whatsa asjudaLorem Ipusum whatsa
              asjudaLorem Ipusum whatsa asjuda
            </p>
          </div>

          {/* Right side: Arrow icon (rotated) */}
          <div className="flex items-start">
            <Image
              src="/images/arrow.png" // make sure this image exists in /public/images/
              alt="Arrow"
              width={16}
              height={16}
              style={{
                transform: "rotate(90deg)",
                marginTop: "12px",
              }}
            />
          </div>
        </div>

        {/* Second Card */}
        <div className="h-[120px] w-full  bg-white rounded-[12px] mt-4 flex justify-between px-4 py-2">
          <div className="flex flex-col flex-1">
            <div className="flex items-center mt-[12px] gap-2">
              <span
                style={{
                  height: "16px",
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  lineHeight: "16px",
                }}
              >
                Nexus Dsliva
              </span>

              <span
                style={{
                  fontSize: "8px",
                  height: "16px",
                  borderRadius: "8px",
                  padding: "0 4px",
                  backgroundColor: "#F9CCC5",
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  lineHeight: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  minWidth: "38px",
                }}
              >
                Verified
              </span>
            </div>

            <p
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "12px",
                lineHeight: "14px",
                marginTop: "6px",
                overflow: "hidden",
                textOverflow: "ellipsis",

                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              Lorem Ipusum whatsa asjuda Lorem Ipusum whatsa asjudaLorem Ipusum
              whatsa asjudaLorem Ipusum whatsa asjudaLorem Ipusum whatsa
              asjudaLorem Ipusum whatsa asjuda
            </p>
          </div>

          {/* Right side: Arrow icon (rotated) */}
          <div className="flex items-start">
            <Image
              src="/images/arrow.png" // make sure this image exists in /public/images/
              alt="Arrow"
              width={16}
              height={16}
              style={{
                transform: "rotate(90deg)",
                marginTop: "12px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client_Testimonial;
