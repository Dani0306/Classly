import React from "react";

const ModalTitle = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="text-foreground/60 text-sm font-light">{description}</p>
      )}
    </div>
  );
};

export default ModalTitle;
