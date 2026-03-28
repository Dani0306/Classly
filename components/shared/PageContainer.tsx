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
    <div className={cn("flex flex-col flex-1 space-y-6", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between">
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
