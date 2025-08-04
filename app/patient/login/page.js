"use client"
import dynamic from "next/dynamic";
const Login = dynamic(() => import('@/components/patient/Login/Login'),{ssr: false})
// import Login from "@/components/patient/Login/Login";
import React from "react";

const page = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default page;
