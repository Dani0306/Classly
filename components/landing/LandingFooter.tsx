"use client";

import Logo from "../shared/Logo";
import { FOOTER_INFO } from "@/data/landing/footer";
import { useInviewCustom } from "@/hooks/shared/useInViewCustom";

const LandingFooter = () => {
  const { ref, inView } = useInviewCustom();

  return (
    <footer
      ref={ref}
      className={`mt-24 pb-10 ${inView && "fade-in"} opacity-0`}
    >
      <div className="mx-auto flex flex-col max-w-280 px-6">
        <Logo />
        <div className="flex flex-wrap gap-8 justify-evenly md:justify-between mt-10">
          {FOOTER_INFO.map((item) => (
            <div key={item.title} className="flex flex-col space-y-3">
              <strong className="font-semibold text-base text-black">
                {item.title}
              </strong>
              <div className="flex flex-col space-y-1">
                {item.links.map((link) => (
                  <span
                    key={link.label}
                    className="text-xs font-light text-gray-600"
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs font-medium text-black flex items-center justify-between mt-16">
          <span>© 2026 Classly. All rights reserved.</span>
          <div className="flex space-x-3">
            <span>Twitter</span>
            <span>GitHub</span>
            <span>Linkedin</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
