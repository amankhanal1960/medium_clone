import React from "react";
import { useRouter } from "next/navigation";

export const Button = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/register?type=join");
  };
  return (
    <button
      className="flex justify-center items-center gap-2 px-[16px] py-[8px] font-normal text-sm bg-black text-white rounded-full"
      onClick={handleLogin}
    >
      Get Started
    </button>
  );
};
