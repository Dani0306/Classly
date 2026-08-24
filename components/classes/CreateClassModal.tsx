import React, { useState, useTransition } from "react";
import Input from "../shared/Input";
import { classIcons } from "@/data/icons/icons";
import { cn } from "@/lib/utils";
import { classColors } from "@/data/colors/colors";
import ModalActionButtons from "../shared/ModalActionButtons";
import { useModal } from "@/providers/AppModalProvider";
import { createClass } from "@/actions/classes/createClass";
import { useToast } from "@/providers/ToastProvider";
import LoadingScreen from "../loading/LoadingScreen";
import ModalTitle from "../modal/ModalTitle";
import { Class } from "@/types";
import { modifyClass } from "@/actions/classes/modifyClass";

const CreateClassModal = ({ classContent }: { classContent?: Class }) => {
  const { closeModal } = useModal();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState<string>(classContent?.name ?? "");
  const [description, setDescription] = useState<string>(
    classContent?.description ?? "",
  );
  const [icon, setIcon] = useState<string>(classContent?.icon ?? "");
  const [color, setColor] = useState<string>(classContent?.color ?? "");

  const createClassFn = () => {
    if (!name || !description) return;

    if (!classContent) {
      startTransition(async () => {
        try {
          await createClass({
            name,
            description,
            icon,
            color,
          });

          toast({
            title: "Class created successfully!",
            type: "success",
          });

          closeModal();
        } catch {
          toast({
            title: "Something went wrong",
            description: "Failed to create the class. Please try again.",
            type: "error",
          });
        }
      });
    } else {
      startTransition(async () => {
        try {
          await modifyClass(
            {
              name,
              description,
              icon,
              color,
            },
            classContent.id,
          );

          toast({
            title: "Class modified successfully!",
            type: "success",
          });

          closeModal();
        } catch {
          toast({
            title: "Something went wrong",
            description: "Failed to modify the class. Please try again.",
            type: "error",
          });
        }
      });
    }
  };

  if (isPending)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen
          message={classContent ? "Modifying Class ..." : "Creating Class ..."}
        />
      </div>
    );

  return (
    <div className="flex flex-col space-y-8 oveflow-auto">
      <ModalTitle
        title={classContent ? "Modify Class" : " New Class"}
        description={
          classContent
            ? "Update your class details below."
            : "Customize your new class to start organizing your notes."
        }
      />

      <Input
        label="Class Name"
        value={name}
        setValue={setName}
        name="name"
        placeholder="Class Name ..."
      />
      <Input
        textarea
        label="Class Description"
        value={description}
        setValue={setDescription}
        name="name"
        placeholder="Class Description ..."
      />

      <div className="flex flex-col space-y-5">
        <label className="text-xs font-medium text-foreground">
          Class Icon
        </label>
        <div className="flex gap-2 flex-wrap items-center justify-center">
          {classIcons.map((item, index) => {
            const selected = icon === item.name;
            return (
              <item.icon
                onClick={() => setIcon(item.name)}
                key={index}
                className={cn(
                  "size-14 p-4 rounded-xl cursor-pointer",
                  selected
                    ? "bg-primary/30 border-2 border-primary"
                    : "bg-foreground/20",
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col space-y-5">
        <label className="text-xs font-medium text-foreground">
          Class Color
        </label>

        <div className="flex gap-2 flex-wrap items-center justify-center">
          {classColors.map((item) => {
            const selected = item.color === color;
            return (
              <div
                onClick={() => setColor(item.color)}
                key={item.name}
                style={{ backgroundColor: item.color }}
                className={cn(
                  "size-10 rounded-full cursor-pointer",
                  selected && "border-3 border-foreground",
                )}
              />
            );
          })}
        </div>
      </div>

      <ModalActionButtons
        cancelAction={closeModal}
        confirmAction={createClassFn}
        confirmText={classContent ? "Modify class" : "Create Class"}
        cancelText="Cancel"
      />
    </div>
  );
};

export default CreateClassModal;
