/**
 * Striped "venetian blind" route transition.
 *
 * The viewport is divided into `STRIPE_COUNT` horizontal bands, each holding an
 * absolutely positioned blind. Closing scales every blind up from nothing to
 * the full band height; opening scales it back down. Blinds are animated one
 * after another from the bottom of the screen upwards, so each half of the wipe
 * reads as a wave travelling up the page.
 *
 * Everything is driven through `transform: scaleY()` rather than a mask, so the
 * whole thing stays on the compositor and never triggers a repaint.
 */

/** Number of horizontal blinds. */
export const STRIPE_COUNT = 30;

/** Seconds a single blind takes to open or close. */
export const STRIPE_DURATION = 0.55;

/** Seconds between one blind starting and its neighbour following. */
export const STRIPE_STAGGER = 0.014;

/**
 * Wall-clock milliseconds for one half of the wipe: the last blind starts after
 * the full stagger has run, then still needs its own duration to finish.
 */
export const PHASE_DURATION_MS =
  (STRIPE_DURATION + STRIPE_STAGGER * (STRIPE_COUNT - 1)) * 1000;

/**
 * `cubic-bezier(0.24, 0.43, 0.15, 0.97)` as SVG path data, for `CustomEase`.
 */
export const TRANSITION_EASE_PATH = 'M0,0 C0.24,0.43 0.15,0.97 1,1';
export const TRANSITION_EASE_NAME = 'chembarathiBlind';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

type Gsap = typeof import('gsap').gsap;

let gsapPromise: Promise<Gsap> | null = null;

/**
 * Loads GSAP once and registers the shared ease. Kept dynamic so the core never
 * lands in the initial bundle; the provider warms it on mount, well before the
 * first navigation can need it.
 */
export function loadGsap(): Promise<Gsap> {
  gsapPromise ??= Promise.all([import('gsap'), import('gsap/CustomEase')]).then(
    ([core, custom]) => {
      const gsap = core.gsap;
      const { CustomEase } = custom;

      gsap.registerPlugin(CustomEase);

      if (!CustomEase.get(TRANSITION_EASE_NAME)) {
        CustomEase.create(TRANSITION_EASE_NAME, TRANSITION_EASE_PATH);
      }

      return gsap;
    }
  );

  return gsapPromise;
}
