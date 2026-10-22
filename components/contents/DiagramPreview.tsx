import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const DiagramPreview = ({ url, title }: { url: string; title: string }) => (
  <figure className="flex flex-col gap-3">
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-ink/[0.04]">
      <Image src={url} alt={title} fill className="object-contain" />
    </div>
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-ink/70 underline underline-offset-4 hover:text-ink"
    >
      Open full size
      <ArrowUpRight className="size-3.5" />
    </a>
  </figure>
);

export default DiagramPreview;
