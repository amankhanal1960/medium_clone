import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div>
      <div className="text-black relative w-full h-screen flex items-center pl-2 sm:pl-12 md:pl-16 lg:pl-28 xl:pl-48">
        <div className="lg:w-2/3  mt-10">
          <h1 className="sm:text-8xl text-7xl font-normal mb-12">
            Human
            <span>
              <br />
              stories & ideas
            </span>
          </h1>
          <p className="text-xl font-normal">
            A place to read, write and deepen your understanding.
          </p>
          <button className="flex justify-center text-xl items-center gap-2 py-2 w-[196px] text-white rounded-full bg-green-700 lg:bg-black mt-10">
            Start Reading
          </button>
        </div>

        <div className="h-full relative z-0 hidden lg:block">
          <Image
            src="/assects/img1.webp"
            alt="Placeholder Image"
            width={600}
            height={600}
            className="w-full h-full mt-[100px] max-h-[600px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
