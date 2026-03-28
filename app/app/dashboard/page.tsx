import { Command, CornerDownRight } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col space-y-4 items-center justify-center">
      <h2 className="text-neon text-4xl md:text-5xl font-extrabold mt-40">
        Ask Classly AI
      </h2>

      <p className="font-light max-w-175 text-center px-6 text-sm">
        The AI Command Center for elite students. Connect your notes, lectures
        and PDFs into one hyper-intelligent workspace.
      </p>

      <div className="w-[95%] md:w-175 mt-5 relative">
        <input
          type="text"
          className="w-full py-4 pl-11 text-foreground pr-16 outline-none border border-neon-no-hover text-sm md:text-base"
          placeholder="Ask your notes anything ..."
        />
        <Command className="absolute size-4.5 text-gray-600 left-4 top-1/2 -translate-y-1/2" />
        <CornerDownRight className="border-2 border-neon size-9 md:size-11 bg-primary p-2.5 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
      </div>
    </div>
  );
};

export default Page;
