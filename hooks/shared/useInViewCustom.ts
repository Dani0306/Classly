import { useInView } from "react-intersection-observer";

export const useInviewCustom = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return { ref, inView };
};
