import React from "react";
import FilePreview from "../files/FilePreview";
import { getTitleByUrl } from "@/utils/fn";

const Attachments = ({ files }: { files: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {files.length === 0 ? (
        <p className="text-foreground text-sm">No attachments found.</p>
      ) : (
        <>
          {" "}
          {files.map((item) => (
            <FilePreview
              key={item}
              small
              url={item}
              title={getTitleByUrl(item)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Attachments;
