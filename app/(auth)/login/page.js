"use client"
import dynamic from "next/dynamic";
const Login = dynamic(() => import('@/components/auth/Login/Login'),{ssr: false})
import React from "react";
const page = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default page;
