import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "note flex flex-col space-y-6 p-6 md:p-8",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <span className="grid place-items-center size-10 shrink-0 rounded-[3px] bg-note-yellow">
            <Icon className="size-4.5 text-foreground" />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
};

export default SettingsSection;
