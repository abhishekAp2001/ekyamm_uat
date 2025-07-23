import Image from 'next/image'
import React from 'react'
import "./footer.css";
import Link from 'next/link';
import { Underline } from 'lucide-react';

const Footer = () => {
   const currentYear = new Date().getFullYear();
  return (
    <>
       <footer style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
      <section className="flex justify-between items-center md:flex-row md:justify-between md:px-10 py-4">
        {/* Logo */}
        <Image
          src="/images/ekyamm.png"
          alt="Company Logo"
          width={200}
          height={60}
          className="logo ekyamm-logo w-[108px] h-auto md:w-[250px]"
        />

        {/* Store buttons */}
        <div id="store" className="flex gap-2 md:mt-0">
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
              className="logo w-auto h-[41px] md:w-full md:h-auto"
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
              className="logo w-auto h-[41px] md:w-full md:h-auto"
            />
          </Link>
        </div>
      </section>

      {/* Copyright */}
      <div
        id="copyright"
        className="text-center text-sm py-2"
      >
        Copyright © {currentYear}&nbsp;Radicle Minds India Private Limited. All rights reserved. |&nbsp;
        <Link
          href="/privacy-policy"
          className='hover:underline privacy'
          style={{ color: "#6d6a5d", fontWeight: 500, cursor: "pointer" }}
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
    </>
  )
}

export default Footer
