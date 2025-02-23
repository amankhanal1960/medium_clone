"use client";
import React, { useState } from "react";
import Image from "next/image";
import RegisterPopup from "./RegisterPopup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const MODE = "start";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-black flex-grow flex items-center justify-between pl-2 sm:pl-12 md:pl-16 lg:pl-28 xl:pl-44">
        <div className="lg:w-2/3 mt-16">
          <h1 className="lg:text-[105px] sm:text-8xl text-7xl font-medium mb-12">
            Human
            <span>
              <br />
              stories & ideas
            </span>
          </h1>
          <p className="text-[22px] font-medium">
            A place to read, write and deepen your understanding.
          </p>
          <button
            onClick={() => {
              if (session && session.user) {
                router.push("/membership");
              } else {
                setIsRegisterPopupOpen(true);
              }
            }}
            className="flex justify-center text-xl items-center gap-2 py-2 w-[196px] text-white rounded-full bg-green-700 lg:bg-black mt-12"
          >
            Start Reading
          </button>
        </div>

        <div className="h-full relative z-0 hidden lg:block">
          <Image
            src="/assects/img1.webp"
            alt="Placeholder Image"
            width={600}
            height={600}
            priority
            className="w-full h-full mt-[50px] max-h-[600px] object-cover"
          />
        </div>
      </div>
      {isRegisterPopupOpen && (
        <RegisterPopup
          onClose={() => setIsRegisterPopupOpen(false)}
          mode={MODE}
        />
      )}
    </div>
  );
};
export default HeroSection;
