import Image from "next/image";
import React from "react";
import "./contact-form.css";

const Contact_Form = () => {
    
  return (
    <>
      <div className="form-popup" id="contactUsForm">
        <div id="close-contactForm" align="right">
          <Image src="public/images/Close.svg" alt="close form" width={20} height={20} className="w-[23px] h-[23px]" />
        </div>
        <form action="/" className="form-container">
          <h1>Get In Touch!</h1>

          <label htmlFor="name">
            <b>Name</b>&nbsp;<span className="compulsory-fields">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your Name"
            name="name"
            required
          />

          <label htmlFor="email">
            <b>Email</b>&nbsp;<span className="compulsory-fields">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your Email"
            name="email"
            required
          />

          <label htmlFor="number">
            <b>Mobile</b>&nbsp;<span className="compulsory-fields">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter your Mobile"
            name="number"
            required
          />

          <label htmlFor="msg">
            <b>Message</b>
          </label>
          <textarea
            name="msg"
            id="msg"
            placeholder="Enter your message"
            cols="30"
            rows="5"
            required
          ></textarea>

          <button type="submit" className="btn">
            Submit
          </button>

          <div align="center" id="form-footer">
            For all inquiries, please feel free to reach out at:
            <br />
            <div className="d-flex align-items-center justify-content-center">
              <Image src="public/images/Call.svg" alt="call" width={15} height={15} className="w-[15px] h-[15px]" />
              &nbsp;
              <a
                href="https://api.whatsapp.com/send/?phone=9920934198&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91&nbsp;99209&nbsp;34198
              </a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contact_Form;
