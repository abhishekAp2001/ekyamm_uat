import P_Mobile_Verification from "@/components/P_Mobile_Verification/P_Mobile_Verification";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
      <P_Mobile_Verification type={type}/>
    </>
  );
};

export default page;
