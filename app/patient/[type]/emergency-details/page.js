import Emergency_Details from "@/components/Emergency_Details/Emergency_Details";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
      <Emergency_Details type={type} />
    </>
  );
};

export default page;
