import React, { useState, useTransition } from "react";
import Input from "../shared/Input";
import { classIcons } from "@/data/icons/icons";
import { cn } from "@/lib/utils";
import ModalActionButtons from "../shared/ModalActionButtons";
import { useModal } from "@/providers/AppModalProvider";
import { createClass } from "@/actions/classes/createClass";
import { useToast } from "@/providers/ToastProvider";
import LoadingScreen from "../loading/LoadingScreen";
import ModalTitle from "../modal/ModalTitle";
import { Class, ScheduleEntry } from "@/types";
import { modifyClass } from "@/actions/classes/modifyClass";
import { X } from "lucide-react";

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const CreateClassModal = ({ classContent }: { classContent?: Class }) => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(
    classContent?.schedule ?? [],
  );

  const addScheduleEntry = () => {
    setSchedule((prev) => [...prev, { day: 1, start_time: "", end_time: "" }]);
  };

  const updateScheduleEntry = (
    index: number,
    field: keyof ScheduleEntry,
    value: string | number,
  ) => {
    setSchedule((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const removeScheduleEntry = (index: number) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const { closeModal } = useModal();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState<string>(classContent?.name ?? "");
  const [description, setDescription] = useState<string>(
    classContent?.description ?? "",
  );
  const [icon, setIcon] = useState<string>(classContent?.icon ?? "");

  const createClassFn = () => {
    if (!name || !description) return;

    if (!classContent) {
      startTransition(async () => {
        try {
          await createClass({
            name,
            description,
            icon,
            color: classIcons.find((item) => item.name === icon)?.color,
            schedule,
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
              color: classIcons.find((item) => item.name === icon)?.color,
              schedule,
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

      <div className="flex flex-col space-y-3">
        <label className="text-xs font-medium text-foreground">
          Class Schedule
        </label>

        {schedule.map((entry, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-foreground/60">Day</label>
              <select
                value={entry.day}
                onChange={(e) =>
                  updateScheduleEntry(index, "day", Number(e.target.value))
                }
                className="px-3 py-2 rounded-lg bg-foreground/10 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <label className="text-xs text-foreground/60">Start</label>
              <input
                type="time"
                value={entry.start_time}
                onChange={(e) =>
                  updateScheduleEntry(index, "start_time", e.target.value)
                }
                className="px-3 py-2 rounded-lg bg-foreground/10 text-sm outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <label className="text-xs text-foreground/60">End</label>
              <input
                type="time"
                value={entry.end_time}
                onChange={(e) =>
                  updateScheduleEntry(index, "end_time", e.target.value)
                }
                className="px-3 py-2 rounded-lg bg-foreground/10 text-sm outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => removeScheduleEntry(index)}
              className="p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 cursor-pointer"
              aria-label="Remove day"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addScheduleEntry}
          className="text-xs font-medium text-primary self-start cursor-pointer hover:underline"
        >
          + Add meeting day
        </button>
      </div>
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
