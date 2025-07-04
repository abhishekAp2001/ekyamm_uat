import EP_registration from "@/components/channel-partner/EP_registration/EP_registration";
import React from "react";

const page = async ({ params }) => {
  const {type} = await params;
  return (
    <>
      <EP_registration type={type} />
    </>
  );
};

export default page;
