import { scrollToElement, scrollToTop } from '@/app/lib/scroll';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function createPolicySectionId(value: string, index: number): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug ? `policy-${slug}` : `policy-section-${index + 1}`;
}

export const POLICY_PAGE_PATH = '/policy';

/** Maps footer labels to the section names used in Contentful. */
export const POLICY_FOOTER_SECTION_NAMES: Record<string, string> = {
  'Privacy Policy': 'Privacy Policy',
  'Terms & Conditions': 'Terms & Conditions',
  'Cancellation Policy': 'Cancellation & Refund Policy',
};

export function getPolicyFooterHref(footerLabel: string): string {
  const sectionName =
    POLICY_FOOTER_SECTION_NAMES[footerLabel] ?? footerLabel;

  return `${POLICY_PAGE_PATH}#${createPolicySectionId(sectionName, 0)}`;
}

export type PolicySectionLike = {
  id: string;
  name?: string;
  heading?: string;
};

export function resolvePolicySectionId(
  hash: string,
  sections: PolicySectionLike[] = []
): string | null {
  if (!hash) {
    return null;
  }

  if (sections.some(section => section.id === hash)) {
    return hash;
  }

  for (const [footerLabel, sectionName] of Object.entries(
    POLICY_FOOTER_SECTION_NAMES
  )) {
    const aliasId = createPolicySectionId(footerLabel, 0);
    const canonicalId = createPolicySectionId(sectionName, 0);

    if (hash !== aliasId && hash !== canonicalId) {
      continue;
    }

    const matchedSection = sections.find(section => {
      const label = section.name || section.heading || '';
      return (
        section.id === canonicalId ||
        createPolicySectionId(label, 0) === canonicalId
      );
    });

    return matchedSection?.id ?? canonicalId;
  }

  const normalizedHash = hash.replace(/^policy-/, '');
  const matchedSection = sections.find(section => {
    const label = section.name || section.heading || '';
    const sectionSlug = createPolicySectionId(label, 0).replace(/^policy-/, '');
    return sectionSlug === normalizedHash;
  });

  return matchedSection?.id ?? null;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrollToPolicySection(
  sectionId: string,
  options: {
    instant?: boolean;
    retries?: number;
    retryDelay?: number;
    sections?: PolicySectionLike[];
  } = {}
): Promise<boolean> {
  const { instant = false, retries = 12, retryDelay = 100, sections = [] } =
    options;
  const resolvedSectionId =
    resolvePolicySectionId(sectionId, sections) ?? sectionId;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const element = document.getElementById(resolvedSectionId);

    if (element) {
      await scrollToElement(element, instant);
      return true;
    }

    if (attempt < retries) {
      await wait(retryDelay);
    }
  }

  return false;
}

export async function navigateToPolicyLink(
  href: string,
  router: AppRouterInstance,
  pathname: string
): Promise<void> {
  const [path, sectionId = ''] = href.split('#');

  if (pathname === path) {
    window.history.pushState(null, '', href);

    if (sectionId) {
      await scrollToPolicySection(sectionId, { instant: false, retries: 12 });
      window.dispatchEvent(
        new CustomEvent('policy-section-navigate', {
          detail: { sectionId },
        })
      );
    } else {
      await scrollToTop(true);
    }

    return;
  }

  router.push(href, { scroll: false });
}

export async function navigateWithScrollReset(
  href: string,
  router: AppRouterInstance,
  pathname: string
): Promise<void> {
  if (href.startsWith(`${POLICY_PAGE_PATH}#`)) {
    await navigateToPolicyLink(href, router, pathname);
    return;
  }

  if (pathname === href) {
    await scrollToTop(true);
    return;
  }

  router.push(href, { scroll: false });
}
