import Landing from "@/components/channel-partner/landing/Landing";
import { Suspense } from "react";
const page = async () => {
  return (
    <Suspense>
      <Landing />
    </Suspense>
  );
};

export default page;
