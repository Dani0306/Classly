import Image from "next/image";

const DiagramPreview = ({ url, title }: { url: string; title: string }) => (
  <div className="relative w-full h-full min-h-75 rounded-xl overflow-hidden bg-black/5">
    <Image src={url} alt={title} fill className="object-contain" />
  </div>
);

export default DiagramPreview;
