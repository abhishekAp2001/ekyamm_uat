import Family_Details from "@/components/Family_Details/Family_Details";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
      <Family_Details type={type} />
    </>
  );
};

export default page;
