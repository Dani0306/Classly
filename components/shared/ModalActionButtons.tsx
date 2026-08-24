import React from "react";
import PageButton from "./PageButton";

const ModalActionButtons = ({
  confirmText,
  cancelText,
  cancelAction,
  confirmAction,
}: {
  confirmText: string;
  cancelText: string;
  cancelAction: () => void;
  confirmAction: () => void;
}) => {
  return (
    <div className="flex justify-end space-x-3">
      <PageButton onClick={cancelAction} text={cancelText} light />
      <PageButton onClick={confirmAction} text={confirmText} />
    </div>
  );
};

export default ModalActionButtons;
