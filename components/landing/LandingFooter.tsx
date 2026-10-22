"use client";

import Logo from "../shared/Logo";
import { FOOTER_INFO } from "@/data/landing/footer";

const LandingFooter = () => {
  return (
    <footer className="mt-32 border-t border-foreground/80 bg-surface pb-10 pt-14">
      <div className="mx-auto flex max-w-6xl flex-col px-5 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <Logo />
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3 md:gap-x-16">
            {FOOTER_INFO.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <strong className="text-sm font-semibold">{item.title}</strong>
                <div className="flex flex-col gap-2">
                  {item.links.map((link) => (
                    <span
                      key={link.label}
                      className="text-sm text-muted-foreground"
                    >
                      {link.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Classly. All rights reserved.</span>
          <div className="flex gap-4">
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
