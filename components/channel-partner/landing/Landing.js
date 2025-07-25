"use client";
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const Landing= () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("u");

  useEffect(() => {
    if (type) {
      console.log("Redirecting to", `/channel-partner/${type}`);
      router.push(`/channel-partner/${type}`);
    } else {
      console.log("No type param found");
    }
  }, [type, router]);

  return (
    <div className="flex items-center justify-center h-screen w-full"
      style={{
        background: `
          linear-gradient(180deg, #DFDAFB 0%, #F9CCC5 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))
        `,
      }}>
      <p className="text-2xl font-semibold text-gray-800">
        {type ? `Redirecting to ${type}…` : 'Missing ?u= parameter'}
      </p>
    </div>
  );
}

export default Landing