import Image from "next/image";

const ImageComponent = ({
  className,
  alt,
  src,
  rounded,
}: {
  className: string;
  alt: string;
  src: string;
  rounded?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image fill alt={alt} src={src} className={rounded && "rounded-full"} />
    </div>
  );
};

export default ImageComponent;
