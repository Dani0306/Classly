import PageButton from "../shared/PageButton";

const QuizNavigation = ({
  isLast,
  isSubmitted,
  isPending,
  onNext,
  onPrev,
  onSubmit,
}: {
  isLast: boolean;
  isSubmitted: boolean;
  isPending: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}) => (
  <div className="flex justify-end pt-2 space-x-3">
    {!isLast && (
      <>
        <PageButton text="Previous" onClick={onPrev} light />
        <PageButton text="Next" onClick={onNext} />
      </>
    )}
    {isLast && !isSubmitted && (
      <PageButton
        text={isPending ? "Submitting..." : "Submit"}
        onClick={onSubmit}
        disabled={isPending}
      />
    )}
    {isLast && isSubmitted && (
      <PageButton text="Previous" onClick={onPrev} light />
    )}
  </div>
);

export default QuizNavigation;
