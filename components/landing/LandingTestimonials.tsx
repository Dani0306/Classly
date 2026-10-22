"use client";

import { testimonials } from "@/data/landing/testimonials";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";
import { calculateStarFillPercentages } from "@/utils/fn";
import Image from "next/image";
import { Star } from "lucide-react";
import React from "react";

const LandingTestimonials = () => {
  const { ref, inView } = useInviewCustom();
  return (
    <section
      id="testimonials"
      ref={ref}
      className={`mx-auto mt-32 w-full max-w-7xl scroll-mt-24 px-5 lg:px-10 ${inView ? "reveal" : ""}`}
    >
      <div className="flex max-w-xl flex-col gap-4">
        <h2 className="text-balance text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">
          What our users say.
        </h2>
        <p className="text-base text-muted-foreground">
          Discover how our users have experienced the platform firsthand.
        </p>
      </div>

      <div className="wall mt-14 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <figure key={item.name} className="note tape tilt flex flex-col gap-5 p-7">
            <div
              className="flex gap-0.5"
              role="img"
              aria-label={`Rated ${item.rating} out of 5`}
            >
              {calculateStarFillPercentages(item.rating).map(
                (rating, index) => (
                  <Star
                    key={index}
                    aria-hidden
                    strokeWidth={2}
                    className={`size-4.5 ${rating === 100 ? "fill-ink text-ink" : "text-ink/30"}`}
                  />
                ),
              )}
            </div>

            <blockquote className="flex-1 text-[15px] leading-relaxed">
              {item.testimonial}
            </blockquote>

            <figcaption className="flex items-center gap-3 border-t border-ink/15 pt-5">
              <div className="relative size-11 shrink-0">
                <Image
                  fill
                  src={item.image}
                  alt={`Photo of ${item.name}`}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <strong className="text-sm font-bold">{item.name}</strong>
                <span className="text-xs text-ink/70">{item.role}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default LandingTestimonials;
