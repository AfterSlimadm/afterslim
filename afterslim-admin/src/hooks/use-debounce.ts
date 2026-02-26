"use client";

import { useState, useEffect } from "react";

/**
 * Debounce a rapidly-changing value.
 * Returns the debounced value that only updates after the specified delay
 * since the last change.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
