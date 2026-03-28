"use client";

import { testimonials } from "@/data/landing/testimonials";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { calculateStarFillPercentages } from "@/utils/fn";
import Image from "next/image";
import React from "react";

const LandingTestimonials = () => {
  const { ref, inView } = useInviewCustom();
  return (
    <div
      ref={ref}
      className={`${
        inView && "slide-up"
      } flex flex-col space-y-4 w-full items-center p-6`}
    >
      <div className="flex flex-col space-y-3 max-w-150 px-6 text-center mx-auto">
        <h2 className="text-black font-semibold text-3xl">
          What our users say.
        </h2>
        <p className="text-sm text-gray-600 font-extralight">
          Discover how our users have experienced the platform firsthand.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 px-6 mt-6 items-center justify-center">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="border-gray-300 border rounded-xl flex flex-col w-87 h-75 p-6 space-y-5 shadow-xl"
          >
            <div className="flex space-x-3 items-center">
              <div className="w-15 h-15 relative">
                <Image
                  fill
                  src={item.image}
                  alt="Customer image"
                  className=" rounded-full"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <strong className="text-black font-medium">{item.name}</strong>
                <p className="text-gray-600 text-sm">{item.role}</p>
              </div>
            </div>
            <div className="flex space-x-0.5">
              {calculateStarFillPercentages(item.rating).map(
                (rating, index) => (
                  <div key={index}>
                    {rating === 100 ? (
                      <div className="relative w-5 h-5">
                        <Image
                          src={"/ratingStar1.png"}
                          fill
                          objectFit="cover"
                          alt="Rating star"
                        />
                      </div>
                    ) : (
                      <div className="relative w-5 h-5">
                        <Image
                          src={"/noStar.png"}
                          fill
                          objectFit="cover"
                          alt="Rating star"
                        />
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
            <p className="text-gray-600 text-sm font-light">
              {item.testimonial}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingTestimonials;
