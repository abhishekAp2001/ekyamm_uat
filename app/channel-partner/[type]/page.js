"use clinet"
import CP_landing from "@/components/CP_Landing/CP_landing";

const page = async ({ params }) => {
  const { type } = await params;
  return (
    <>
    <CP_landing type={type} />
    </>
  );
};

export default page;
