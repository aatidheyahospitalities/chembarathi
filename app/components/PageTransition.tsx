'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { scrollToTop } from '@/app/lib/scroll';
import {
  STRIPE_COUNT,
  STRIPE_DURATION,
  STRIPE_STAGGER,
  TRANSITION_EASE_NAME,
  loadGsap,
  prefersReducedMotion,
} from '@/app/lib/pageTransition';

type NavigateOptions = { scroll?: boolean };
type Navigate = (href: string, options?: NavigateOptions) => void;

/** Reveal anyway if the new route never commits (offline, RSC error, …). */
const REVEAL_TIMEOUT = 6000;

/**
 * Last-resort release. GSAP's ticker stops while a tab is in the background, so
 * a wipe can be left part-finished — invisible, but still holding the busy flag
 * and blocking every later navigation. This force-settles it.
 */
const WATCHDOG_TIMEOUT = 15000;

const NavigateContext = createContext<Navigate | null>(null);

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const blinds = useRef<HTMLSpanElement[]>([]);
  const timeout = useRef<number | null>(null);
  const watchdog = useRef<number | null>(null);
  const pending = useRef<{
    path: string;
    hash: string;
    /** Set for back/forward, where the browser owns the scroll position. */
    pop?: boolean;
  } | null>(null);
  const busy = useRef(false);
  const snapshot = useRef<HTMLElement | null>(null);
  /** Resolves when the blinds have finished closing. */
  const covered = useRef<Promise<void> | null>(null);

  /** The committed pathname, readable from non-React callbacks. */
  const committed = useRef(pathname);

  // Warm GSAP up front so the first navigation never waits on the import.
  useEffect(() => {
    void loadGsap();
  }, []);

  useEffect(() => {
    committed.current = pathname;
  }, [pathname]);

  /**
   * Runs one half of the wipe. Blinds sit top-to-bottom in the DOM, so
   * staggering `from: 'end'` starts at the bottom of the screen and travels
   * up. Closing grows each blind upwards off its lower edge and opening
   * retracts it upwards into its upper edge, keeping the motion going one way.
   */
  const animateBlinds = useCallback(async (open: boolean) => {
    const gsap = await loadGsap();
    const targets = blinds.current.filter(Boolean);
    if (!targets.length) return;

    gsap.set(targets, { transformOrigin: open ? '50% 0%' : '50% 100%' });

    await gsap.to(targets, {
      scaleY: open ? 0 : 1,
      duration: STRIPE_DURATION,
      ease: TRANSITION_EASE_NAME,
      stagger: { each: STRIPE_STAGGER, from: 'end' },
      overwrite: 'auto',
    });
  }, []);

  const clearSnapshot = useCallback(() => {
    snapshot.current?.remove();
    snapshot.current = null;
  }, []);

  /** Drops everything back to a clean, navigable state. */
  const settle = useCallback(async () => {
    if (timeout.current !== null) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }
    if (watchdog.current !== null) {
      window.clearTimeout(watchdog.current);
      watchdog.current = null;
    }

    const targets = blinds.current.filter(Boolean);
    const gsap = await loadGsap();

    gsap.killTweensOf(targets);
    gsap.set(targets, { scaleY: 0, transformOrigin: '50% 100%' });

    clearSnapshot();
    covered.current = null;
    pending.current = null;
    busy.current = false;
  }, [clearSnapshot]);

  /** Marks a wipe as running and arms the release that guarantees it ends. */
  const beginTransition = useCallback(() => {
    busy.current = true;

    if (watchdog.current !== null) window.clearTimeout(watchdog.current);
    watchdog.current = window.setTimeout(() => void settle(), WATCHDOG_TIMEOUT);
  }, [settle]);

  const reveal = useCallback(async () => {
    const target = pending.current;
    pending.current = null;

    if (timeout.current !== null) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }

    try {
      // On a history traversal the route commits while the blinds are still
      // closing, so hold the reveal until the first half has actually finished.
      await covered.current;
      covered.current = null;
      clearSnapshot();

      // Reset scroll here, behind the closed blinds, rather than leaving it to
      // RouteScrollManager — its reset races the reveal and the jump ends up
      // on screen. Only deep links are exempt: they own their scroll target.
      if (!target?.hash) {
        await scrollToTop(true);
      }

      // Let the incoming route paint, and the scroll reset land, before the
      // blinds open.
      await new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );

      await animateBlinds(true);
    } finally {
      // However this ended, the page has to be navigable again.
      if (watchdog.current !== null) {
        window.clearTimeout(watchdog.current);
        watchdog.current = null;
      }
      busy.current = false;
    }
  }, [animateBlinds, clearSnapshot]);

  const navigate = useCallback<Navigate>(
    (href, options) => {
      if (busy.current) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        router.push(href, options);
        return;
      }

      // Same-page hash changes and reduced-motion users skip the wipe.
      if (url.pathname === pathname || prefersReducedMotion()) {
        router.push(href, options);
        return;
      }

      beginTransition();
      router.prefetch(href);

      covered.current = animateBlinds(false).then(() => {
        pending.current = { path: url.pathname, hash: url.hash };
        router.push(href, options);
        timeout.current = window.setTimeout(
          () => void reveal(),
          REVEAL_TIMEOUT
        );
      });
    },
    [animateBlinds, beginTransition, pathname, reveal, router]
  );

  // Back/forward. Unlike a link click we cannot delay the route swap — the URL
  // has already changed and React commits the new page as soon as its data
  // resolves, well inside the closing half of the wipe. So we freeze the
  // outgoing page first: a detached clone of #smooth-content, pinned over the
  // viewport at the scroll offset it is currently showing. The blinds close
  // over that still frame while the real route swaps invisibly underneath,
  // then the clone is dropped and the blinds open on the new page — the same
  // two phases a link click gets.
  useEffect(() => {
    const freezeOutgoingPage = (): HTMLElement | null => {
      const source = document.getElementById('smooth-content');
      if (!source) return null;

      const frozen = source.cloneNode(true) as HTMLElement;
      frozen.removeAttribute('id');
      frozen.style.willChange = 'auto';

      // Above 1024px ScrollSmoother already carries the scroll as a transform
      // on #smooth-content, which the clone inherits. Below it, scrolling is
      // native, so the clone has to be offset by hand.
      if (!source.style.transform) {
        frozen.style.transform = `translateY(${-window.scrollY}px)`;
      }

      const host = document.createElement('div');
      host.className = 'page-transition-snapshot';
      host.setAttribute('aria-hidden', 'true');
      host.appendChild(frozen);
      document.body.appendChild(host);

      return host;
    };

    const handlePopState = () => {
      if (busy.current || prefersReducedMotion()) return;

      const nextPath = window.location.pathname;

      // Hash-only pops, and the rare pop we hear about after React has already
      // swapped the route, are left alone — covering then would only flicker.
      if (nextPath === committed.current) return;

      beginTransition();

      // Synchronous, so the clone captures the outgoing page before React gets
      // a chance to paint the incoming one.
      snapshot.current = freezeOutgoingPage();

      pending.current = {
        path: nextPath,
        hash: window.location.hash,
        pop: true,
      };

      if (!snapshot.current) {
        // Nothing to animate over: cover instantly rather than wipe across the
        // page that is about to appear.
        for (const blind of blinds.current) {
          if (blind) blind.style.transform = 'scaleY(1)';
        }
      } else {
        covered.current = animateBlinds(false);
      }

      timeout.current = window.setTimeout(() => void reveal(), REVEAL_TIMEOUT);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [animateBlinds, beginTransition, reveal]);

  // The blinds open once the route we covered for has actually committed.
  useEffect(() => {
    if (pending.current === null || pending.current.path !== pathname) return;
    void reveal();
  }, [pathname, reveal]);

  // Catch every internal <a> (including next/link) before its own handler runs.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;

      if (
        !anchor ||
        anchor.hasAttribute('download') ||
        anchor.dataset.noTransition !== undefined ||
        (anchor.target && anchor.target !== '_self')
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Cross-origin links and in-page anchors keep their native behaviour.
      if (
        url.origin !== window.location.origin ||
        url.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [navigate]);

  useEffect(
    () => () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current);
      if (watchdog.current !== null) window.clearTimeout(watchdog.current);
      snapshot.current?.remove();
      snapshot.current = null;
    },
    []
  );

  return (
    <NavigateContext.Provider value={navigate}>
      {children}
      <div aria-hidden className="page-transition">
        {Array.from({ length: STRIPE_COUNT }, (_, index) => (
          <span
            key={index}
            ref={element => {
              if (element) blinds.current[index] = element;
            }}
            className="page-transition__blind"
            style={{ top: `${(index * 100) / STRIPE_COUNT}%` }}
          />
        ))}
      </div>
    </NavigateContext.Provider>
  );
}

/**
 * Drop-in replacement for `useRouter()` whose `push`/`replace` play the wipe.
 * Everything else on the router is passed through untouched.
 */
export function useTransitionRouter(): AppRouterInstance {
  const router = useRouter();
  const navigate = useContext(NavigateContext);

  return useMemo(() => {
    if (!navigate) return router;

    return {
      ...router,
      push: (href: string, options?: NavigateOptions) =>
        navigate(href, options),
      replace: (href: string, options?: NavigateOptions) =>
        navigate(href, options),
    };
  }, [navigate, router]);
}
