'use client';

import { useEffect, useRef } from 'react';

import type { IIntersectionObserverOptions } from '@/types/intersectionObserver';

export function useIntersectionObserver({
  onIntersect,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true
}: IIntersectionObserverOptions) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentTarget = targetRef.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onIntersect, threshold, rootMargin, enabled]);

  return targetRef;
}
