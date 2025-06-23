import Verified_Successfully from "@/components/patient/verified_successfully";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;

  return (
    <>
      <Verified_Successfully type={type} />
    </>
  );
};

export default page;
