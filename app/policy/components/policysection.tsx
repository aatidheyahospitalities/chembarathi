'use client';

import { policyType } from '@/app/lib/type';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function createSectionId(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug ? `policy-${slug}` : `policy-section-${index + 1}`;
}

export function PolicySection({ contents }: { contents: policyType | null }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const sidebarPanelRef = useRef<HTMLDivElement | null>(null);

  const sections = useMemo(
    () =>
      (contents?.policyblockCollection.items ?? []).map((item, index) => ({
        ...item,
        id: createSectionId(item.name || item.heading, index),
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
    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    setActiveSection(sectionId);

    try {
      const { ScrollSmoother } = await import('gsap/ScrollSmoother');
      const smoother = ScrollSmoother.get();

      if (smoother) {
        smoother.scrollTo(element, true, 'top 140px');
        return;
      }
    } catch {
      // Fall through to native smooth scrolling if smoother is unavailable.
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!sections.length) {
    return null;
  }

  return (
    <section ref={rootRef} className="px-(--spacing-padding-huge-x)!">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[400px_minmax(0,1fr)] gap-(--spacing-padding-huge-x)">
        <aside className="self-start py-(--spacing-padding-huge-x)!">
          <div ref={sidebarPanelRef} className="w-[400px] rounded-[24px] px-6 py-8">
            <div className="flex flex-col gap-(--spacing-padding-8x)">
              <p className="text-(--typography-color-secondary-100) font-[22px]">
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
            <h1 className="text-heading-4 text-(--typography-color-secondary-800) font-secondary!">
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

                <div className="space-y-4 text-xl-regular leading-8 text-(--typography-color-secondary-800)">
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
