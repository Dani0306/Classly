"use client";

import { testimonials } from "@/data/landing/testimonials";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { calculateStarFillPercentages } from "@/utils/fn";
import Image from "next/image";
import React from "react";

const LandingTestimonials = () => {
  const { ref, inView } = useInviewCustom();
  return (
    <section
      id="testimonials"
      ref={ref}
      className={`mx-auto mt-32 w-full max-w-6xl scroll-mt-24 px-5 lg:px-8 ${inView ? "reveal" : ""}`}
    >
      <div className="flex max-w-xl flex-col gap-4">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          What our users <span className="marker">say.</span>
        </h2>
        <p className="text-base text-muted-foreground">
          Discover how our users have experienced the platform firsthand.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <figure key={item.name} className="sheet flex flex-col gap-5 p-6">
            <div className="flex gap-0.5">
              {calculateStarFillPercentages(item.rating).map(
                (rating, index) => (
                  <div key={index} className="relative size-5">
                    <Image
                      src={rating === 100 ? "/ratingStar1.png" : "/noStar.png"}
                      fill
                      className="object-cover"
                      alt="Rating star"
                    />
                  </div>
                ),
              )}
            </div>

            <blockquote className="flex-1 text-sm leading-relaxed text-foreground/85">
              {item.testimonial}
            </blockquote>

            <figcaption className="flex items-center gap-3 border-t border-border-soft pt-5">
              <div className="relative size-11 shrink-0">
                <Image
                  fill
                  src={item.image}
                  alt={`Photo of ${item.name}`}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <strong className="text-sm font-semibold">{item.name}</strong>
                <span className="text-xs text-muted-foreground">
                  {item.role}
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default LandingTestimonials;
