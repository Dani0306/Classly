"use client";

import { normalize } from "@/utils/fn";
import { useEffect, useState } from "react";

export const useDebounce = (delay = 200, initialValue = "") => {
  const [query, setQuery] = useState<string>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<string>(query);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(query);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [query, delay]);

  const value = normalize(debouncedValue);

  return { value, query, setQuery };
};
