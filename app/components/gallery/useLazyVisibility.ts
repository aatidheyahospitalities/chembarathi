'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * One IntersectionObserver shared by every gallery item.
 *
 * A per-item observer would mean thousands of observer instances and thousands
 * of separate callback queues on a large gallery. Instead a single observer
 * holds a Map of element -> callback, and each item registers itself. Items are
 * unobserved the moment they first intersect, so the observed set shrinks as
 * the user scrolls and never grows past "not yet loaded".
 */

export type ObserveFn = (element: Element, onEnter: () => void) => () => void;

interface Registry {
  observe: ObserveFn;
  disconnect: () => void;
}

/**
 * Finds the nearest ancestor that clips its overflow.
 *
 * This matters because an IntersectionObserver's intersection rect is clipped
 * by every ancestor clip, which silently cancels out `rootMargin`. On this site
 * GSAP's ScrollSmoother turns `#smooth-wrapper` into a viewport-sized
 * `position: fixed; overflow: hidden` box, so observing against the viewport
 * would only ever report items that are *already* on screen — the preload
 * margin would do nothing and every image would visibly pop in.
 *
 * Using that clipping ancestor as the observer root restores the margin. When
 * ScrollSmoother is off (below 1024px the wrapper reverts to `overflow:
 * visible`) no clipping ancestor is found and the viewport is used, which is
 * the correct root for native scrolling.
 */
function findClipRoot(element: Element): Element | null {
  let node = element.parentElement;

  while (node && node !== document.body && node !== document.documentElement) {
    const { overflow, overflowY } = getComputedStyle(node);
    if (overflow !== 'visible' || overflowY !== 'visible') return node;
    node = node.parentElement;
  }

  return null;
}

function createRegistry(rootMargin: string, root: Element | null): Registry {
  const callbacks = new Map<Element, () => void>();

  // Older/edge environments without IntersectionObserver load everything
  // rather than showing skeletons forever.
  if (typeof IntersectionObserver === 'undefined') {
    return {
      observe: (_element, onEnter) => {
        onEnter();
        return () => {};
      },
      disconnect: () => {},
    };
  }

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const onEnter = callbacks.get(entry.target);
        // Loading is one-way, so stop watching immediately.
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
        onEnter?.();
      }
    },
    { root, rootMargin }
  );

  return {
    observe(element, onEnter) {
      callbacks.set(element, onEnter);
      observer.observe(element);

      return () => {
        callbacks.delete(element);
        observer.unobserve(element);
      };
    },
    disconnect() {
      callbacks.clear();
      observer.disconnect();
    },
  };
}

/**
 * Returns a stable `observe` function. Stability matters: it is passed down to
 * every memoized gallery item, and a new identity each render would defeat the
 * memoization and re-run every item's effect.
 *
 * `resetKey` rebuilds the observer when the surrounding layout changes in a way
 * that can change the clip root — crossing the 1024px breakpoint switches
 * ScrollSmoother on and off, which is exactly such a change.
 */
export function useLazyObserver(
  rootMargin: string,
  resetKey: unknown = null
): ObserveFn {
  const stateRef = useRef<{ key: unknown; registry: Registry } | null>(null);

  useEffect(() => {
    return () => {
      stateRef.current?.registry.disconnect();
      stateRef.current = null;
    };
  }, []);

  return useCallback(
    (element, onEnter) => {
      const current = stateRef.current;

      // Swapping the observer inside observe() rather than in an effect is
      // deliberate. React runs child effects before parent effects, so a
      // parent effect would tear down the observer the items had just
      // registered with and leave nothing observed.
      if (current && current.key !== resetKey) {
        current.registry.disconnect();
        stateRef.current = null;
      }

      // Built on first use, which is always inside a child effect on the
      // client — the element is attached, so its ancestors can be inspected.
      stateRef.current ??= {
        key: resetKey,
        registry: createRegistry(rootMargin, findClipRoot(element)),
      };

      return stateRef.current.registry.observe(element, onEnter);
    },
    [rootMargin, resetKey]
  );
}
