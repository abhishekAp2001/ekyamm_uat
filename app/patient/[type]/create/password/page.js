import P_Create_Account from "@/components/patient/P_Create_Account/P_Create_Account";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
      <P_Create_Account type={type} />
    </>
  );
};

export default page;
