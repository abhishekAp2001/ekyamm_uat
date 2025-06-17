import Patient_History from "@/components/Patient_History/Patient_History";
import React from "react";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
      <Patient_History type={type} />
    </>
  );
};

export default page;
