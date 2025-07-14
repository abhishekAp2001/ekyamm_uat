'use client'
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDisableBounce } from "./useDisableBounce";
import { usePathname } from "next/navigation";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});
export default function RootLayout({ children }) {
    const pathname = usePathname();
   const isFullWidthPage = pathname === '/' || pathname === '/mh-practitioner' || pathname === '/request-account-delete' || pathname === '/request-account-delete-success' || pathname === '/privacy-policy';
  const isPrivacyPage = pathname === '/privacy-policy';
  // useDisableBounce()
  return (
    <html lang="en">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
        <meta name="apple-mobile-web-app-capable" content="yes" /> */}
      {/* <body
        className={`${quicksand.variable} bg-gradient-to-t from-[#eeecfb] to-[#fce8e5] md:bg-black md:bg-none md:from-transparent md:to-transparent antialiased max-w-[576px] h-screen mx-auto 
 `}
      > */}
       {/* <body
        className={`
          ${quicksand.variable} 
          bg-gradient-to-t from-[#eeecfb] to-[#fce8e5] 
          md:bg-black md:bg-none md:from-transparent md:to-transparent 
          antialiased h-screen 
          ${isFullWidthPage ? 'w-full' : 'max-w-[576px] mx-auto'}
        `}
      > */}
      <body
        className={`
          ${quicksand.variable} 
          antialiased h-screen 
          ${isFullWidthPage ? 'w-full' : 'max-w-[576px] mx-auto'}
          ${isPrivacyPage 
            ? 'bg-privacy-gradient' 
            : 'bg-gradient-to-t from-[#eeecfb] to-[#fce8e5] md:bg-black md:bg-none md:from-transparent md:to-transparent'
          }
        `}
      >
        {children}
        <ToastContainer position="bottom-center" closeButton={false} />
      </body>
    </html>
  );
}
