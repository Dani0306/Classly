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
        "flex flex-col space-y-6 rounded-2xl bg-surface p-6 md:p-8 shadow-xl",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <span className="grid place-items-center size-10 shrink-0 rounded-xl bg-surface-green">
            <Icon className="size-4.5 text-green-700" />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs font-light text-foreground/60">
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
