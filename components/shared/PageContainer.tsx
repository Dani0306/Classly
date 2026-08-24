import { cn } from "@/lib/utils";

const PageContainer = ({
  children,
  className,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 space-y-10 pt-12 md:pt-0 md:pl-14",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex-col md:flex-row flex gap-6  md:items-center justify-between">
          <div className="flex flex-col gap-1">
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
