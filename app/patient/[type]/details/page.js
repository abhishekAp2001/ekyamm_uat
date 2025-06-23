import PP_Details from "@/components/PP_details/PP_details";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
      <PP_Details type={type}/>
    </>
  );
};

export default page;
