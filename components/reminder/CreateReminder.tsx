import React, { useState, useTransition } from "react";
import LoadingScreen from "../loading/LoadingScreen";
import Input from "../shared/Input";
import { TypeBadge } from "../contents/ContentCard";
import ModalTitle from "../modal/ModalTitle";
import { contentTypes } from "@/data/colors/typeColors";
import { Bell } from "lucide-react";
import DatePicker from "../shared/DatePicker";
import SelectOptions from "../shared/SelectOptions";
import { createContent } from "@/actions/contents/createContent";
import { useToast } from "@/providers/ToastProvider";
import { useModal } from "@/providers/AppModalProvider";

const priorities = ["low", "medium", "high"];

const CreateReminder = ({ classId }: { classId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  const { closeModal } = useModal();

  const { toast } = useToast();

  const createReminder = () => {
    startTransition(async () => {
      try {
        await createContent({
          title,
          content: description,
          class_id: classId,
          type: "reminder",
          due_date: dueDate,
        });
        toast({
          title: "Reminder generated successfully!",
          type: "success",
        });

        closeModal();
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div className="w-full rounded-xl flex flex-col space-y-6">
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingScreen message="Creating reminder ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-3">
            <div>
              <TypeBadge type="reminder" />
            </div>
            <ModalTitle
              title="New Reminder"
              description="Set an alert with a date, time, and priority so you never miss what matters."
            />
          </div>

          <div className="flex flex-1 flex-col space-y-4 px-0">
            <Input
              value={title}
              setValue={setTitle}
              label="Title"
              placeholder="Title ..."
              name="title"
            />
            <Input
              value={description}
              setValue={setDescription}
              label="Description"
              placeholder="Description ..."
              name="description"
              textarea
              rows={8}
            />
            <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row items-center space-x-4">
              <DatePicker
                value={dueDate}
                setValue={setDueDate}
                placeholder="Reminder Date"
                label="Reminder Date"
              />

              <SelectOptions
                name="priority"
                placeholder="Select Priority"
                options={priorities}
                label="Priority"
                value={priority}
                setValue={setPriority}
              />
            </div>
          </div>
          <button
            onClick={createReminder}
            disabled={!title || !description || !dueDate || !priority}
            style={{
              backgroundColor: contentTypes.find(
                (item) => item.type === "reminder",
              )?.color,
            }}
            className="w-full disabled:opacity-50 lg:mb-0 mb-8 py-2.5 text-white font-medium text-sm rounded-full flex space-x-1.5 items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer"
          >
            <Bell className="size-4 text-white" />
            <span>Save Reminder</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CreateReminder;
