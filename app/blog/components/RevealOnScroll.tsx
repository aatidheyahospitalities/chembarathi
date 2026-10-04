'use client';

import { useRef, type ReactNode } from 'react';

import { useRevealOnScroll } from './useRevealOnScroll';

/**
 * Mounts `useRevealOnScroll` around server-rendered content.
 *
 * The hook needs a client component to hold the ref, but the rows it animates
 * (`BlogRow`) are server-rendered. Passing them through `children` keeps them
 * on the server — this wrapper only supplies the ref and the effect.
 *
 * `count` is what re-runs the hook when the child list grows; a static list
 * can leave it at the number of children.
 */
export default function RevealOnScroll({
  count,
  className,
  children,
}: Readonly<{ count: number; className?: string; children: ReactNode }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  useRevealOnScroll(ref, count);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
