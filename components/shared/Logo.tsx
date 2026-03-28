import React from "react";
import ImageComponent from "./ImageComponent";

type LogoSize = "lg" | "md" | "sm";
type LogoVersion = "full" | "cut";

interface LogoProps {
  size?: LogoSize;
  version?: LogoVersion;
}

const Logo = ({ size = "md", version = "full" }: LogoProps) => {
  const sizeMap = {
    sm: {
      image: "w-6 h-8",
      text: "text-lg",
      gap: "gap-2",
    },
    md: {
      image: "w-8 h-10",
      text: "text-xl",
      gap: "gap-2.5",
    },
    lg: {
      image: "w-10 h-12",
      text: "text-2xl",
      gap: "gap-3",
    },
  };

  return (
    <div className={`flex items-center ${sizeMap[size].gap}`}>
      <ImageComponent
        className={sizeMap[size].image}
        alt="Classly Logo"
        src="/logo.png"
      />

      {version === "full" && (
        <span className={`font-bold tracking-tight ${sizeMap[size].text}`}>
          Classly
        </span>
      )}
    </div>
  );
};

export default Logo;
