import { cn } from "@/lib/utils";

const QuizProgress = ({
  current,
  total,
  index,
}: {
  current: number;
  total: number;
  index: number;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground">
      Question {index + 1} of {total}
    </span>
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 w-5 rounded-full transition-colors duration-300",
            i <= current ? "bg-primary" : "bg-gray-200",
          )}
        />
      ))}
    </div>
  </div>
);

export default QuizProgress;
