const DateBadge = ({
  timestamp,
  color,
}: {
  timestamp: string;
  color?: string;
}) => {
  const date = new Date(timestamp);

  const month = date
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const year = date.toLocaleDateString("en-US", { year: "numeric" });

  return (
    <div className="inline-flex flex-col items-center w-15 rounded-lg overflow-hidden bg-[#eee]">
      <div
        className="w-full py-0.5 text-center"
        style={{
          backgroundColor:
            color === "red"
              ? "#ef4444"
              : color === "orange"
                ? "#f59e0b"
                : "#35f527",
        }}
      >
        <span className="text-[9px] font-medium text-white tracking-wide">
          {month}
        </span>
      </div>
      <div className="flex flex-col items-center py-1">
        <span className="text-[13px] font-semibold text-foreground leading-none">
          {day}
        </span>
        <span className="text-[9px] text-muted-foreground mt-0.5">{year}</span>
      </div>
    </div>
  );
};

export default DateBadge;
