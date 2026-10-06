import { useRef, useCallback } from 'react';
import { stagger } from './tokens.js';

export function useScrollReveal(staggerInterval = stagger.normal) {
  const containerRef = useRef(null);

  const getChildProps = useCallback(
    (index) => ({
      delay: index * staggerInterval,
    }),
    [staggerInterval],
  );

  return { containerRef, getChildProps };
}
