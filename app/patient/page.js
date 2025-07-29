import Patient_Landing from "@/components/patient/Patient_Landing/Patient_Landing";
import { Suspense } from "react";
const page = async () => {
  return (
    <Suspense>
      <Patient_Landing />
    </Suspense>
  );
};

export default page;
