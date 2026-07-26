'use client';

import { policyType } from '@/app/lib/type';
import {
  createPolicySectionId,
  resolvePolicySectionId,
  scrollToPolicySection,
} from '@/app/policy/utils';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function PolicySection({ contents }: { contents: policyType | null }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const sidebarPanelRef = useRef<HTMLDivElement | null>(null);

  const sections = useMemo(
    () =>
      (contents?.policyblockCollection.items ?? []).map((item, index) => ({
        ...item,
        id: createPolicySectionId(item.name || item.heading, index),
      })),
    [contents]
  );

  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id ?? ''
  );

  const currentActiveSection = sections.some(
    section => section.id === activeSection
  )
    ? activeSection
    : sections[0]?.id ?? '';

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    setActiveSection(previous =>
      sections.some(section => section.id === previous)
        ? previous
        : sections[0].id
    );
  }, [sections]);

  const scrollToResolvedSection = async (
    hash: string,
    options?: { instant?: boolean; retries?: number }
  ) => {
    const resolvedId = resolvePolicySectionId(hash, sections);
    if (!resolvedId) {
      return;
    }

    setActiveSection(resolvedId);
    await scrollToPolicySection(resolvedId, {
      ...options,
      sections,
    });
  };

  useLayoutEffect(() => {
    if (!sections.length || !rootRef.current || !sidebarPanelRef.current) {
      return;
    }

    let isDisposed = false;
    let cleanup: (() => void) | undefined;

    const setupGsap = async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (isDisposed || !rootRef.current || !sidebarPanelRef.current) {
          return;
        }

        const ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: rootRef.current,
            start: 'top top+=112',
            end: 'bottom bottom-=48',
            pin: sidebarPanelRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (!element) {
              return;
            }

            ScrollTrigger.create({
              trigger: element,
              start: 'top center',
              end: 'bottom center',
              onToggle: self => {
                if (self.isActive) {
                  setActiveSection(section.id);
                }
              },
            });
          });

          ScrollTrigger.refresh();

          const hash = window.location.hash.slice(1);
          const resolvedId = resolvePolicySectionId(hash, sections);

          if (resolvedId) {
            setActiveSection(resolvedId);
            window.setTimeout(() => {
              void scrollToResolvedSection(resolvedId, {
                instant: false,
                retries: 8,
              });
            }, 250);
          }
        }, rootRef);

        cleanup = () => ctx.revert();
      } catch {
        cleanup = undefined;
      }
    };

    setupGsap();

    return () => {
      isDisposed = true;
      cleanup?.();
    };
  }, [sections]);

  const handleSectionClick = async (sectionId: string) => {
    await scrollToResolvedSection(sectionId);
  };

  useEffect(() => {
    const scrollToHashSection = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        return;
      }

      void scrollToResolvedSection(hash, { instant: false, retries: 12 });
    };

    const handlePolicySectionNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ sectionId?: string }>).detail;
      if (detail?.sectionId) {
        void scrollToResolvedSection(detail.sectionId, {
          instant: false,
          retries: 12,
        });
      }
    };

    const handleHashChange = () => {
      void scrollToHashSection();
    };

    if (window.location.hash) {
      const timer = window.setTimeout(() => {
        void scrollToHashSection();
      }, 200);

      window.addEventListener('hashchange', handleHashChange);
      window.addEventListener('policy-section-navigate', handlePolicySectionNavigate);

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('hashchange', handleHashChange);
        window.removeEventListener(
          'policy-section-navigate',
          handlePolicySectionNavigate
        );
      };
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('policy-section-navigate', handlePolicySectionNavigate);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener(
        'policy-section-navigate',
        handlePolicySectionNavigate
      );
    };
  }, [sections]);

  if (!sections.length) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className="px-(--spacing-padding-huge-x)! font-secondary"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[400px_minmax(0,1fr)] gap-(--spacing-padding-huge-x)">
        <aside className="self-start py-(--spacing-padding-huge-x)!">
          <div ref={sidebarPanelRef} className="w-[400px] rounded-[24px] px-6 py-8">
            <div className="flex flex-col gap-(--spacing-padding-8x)">
              <p className="text-lg-regular text-(--typography-color-secondary-100)">
                Sections
              </p>

              <nav className="flex flex-col gap-[10px]">
                {sections.map(section => {
                  const isActive = currentActiveSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleSectionClick(section.id)}
                      className={`text-lg-regular text-left transition-colors duration-200 ${
                        isActive
                          ? 'text-white!'
                          : 'text-(--typography-color-primary-400)! hover:text-(--typography-color-secondary-100)!'
                      }`}
                    >
                      {section.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 max-w-[760px] flex-col gap-(--spacing-padding-10x) py-(--spacing-padding-huge-x)!">
          <div className="space-y-4">
            <h1 className="text-heading-4 text-(--typography-color-secondary-800)">
              Policies and Terms
            </h1>
          </div>

          <div className="flex flex-col gap-(--spacing-padding-10x)">
            {sections.map(section => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-40 flex flex-col gap-[24px] py-(--spacing-padding-10x)!"
              >
                <h2 className="text-xxl-regular text-(--typography-color-secondary-100)">
                  {section.heading}
                </h2>

                <div className="policy-markdown space-y-4 text-xl-regular text-(--typography-color-secondary-800)">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {section.content}
                  </ReactMarkdown>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
