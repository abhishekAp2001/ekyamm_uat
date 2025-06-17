import Verified_Successfully from "@/components/Verified_Successfully/Verified_Successfully";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;

  return (
    <>
      <Verified_Successfully type={type}/>
    </>
  );
};

export default page;
