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
  useEffect(() => {
  const preventMultiTouch = (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  };
  document.addEventListener('touchmove', preventMultiTouch, { passive: false });
 
  return () => {
    document.removeEventListener('touchmove', preventMultiTouch);
  };
}, []);
    const pathname = usePathname();
   const isFullWidthPage = pathname === '/' || pathname === '/mh-practitioner' || pathname === '/request-account-delete' || pathname === '/request-account-delete-success' || pathname === '/privacy-policy';
  const isPrivacyPage = pathname === '/privacy-policy';
  // useDisableBounce()
  return (
    <html lang="en">
      <head>
        <title>Dashboard</title>
        <link rel="icon" href="/images/logo-circle-hands.svg" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/images/icon-192x192.png" />
      </head>
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
