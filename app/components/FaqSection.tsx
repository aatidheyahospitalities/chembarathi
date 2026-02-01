import { FaqItemType } from '../lib/type';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqSection(faqData: Readonly<FaqItemType>) {
  const List = faqData.faqItemCollection;

  return (
    <div
      className="flex flex-col section-wrapper"
      style={{ gap: 'var(--spacing-padding-8x)' }}
    >
      <div
        className="flex flex-col w-[50%] xs:!w-full"
        style={{ gap: 'var(--spacing-padding-3x)' }}
      >
        <span
          className="text-md-regular"
          style={{ color: 'var(--typography-color-secondary-500)' }}
        >
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2
          style={{ color: 'var(--typography-color-secondary-100)' }}
          className="text-heading-2 xs:!text-h4"
        >
          Your Stay, Simplified
        </h2>
      </div>

      <div className="w-full max-w-[974px]">
        <Accordion type="single" collapsible className="w-full">
          {List.items.map((faqItem, index) => (
            <AccordionItem
              key={index + 1}
              value={`item-${index}`}
              className="border-none group"
            >
              <AccordionTrigger
                className="
                flex justify-between text-left  
                no-underline hover:no-underline
                relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[#2B2B2B]
                hide-default-icon accordion-trigger
                transition-all duration-200 ease-in-out
                xs:!text-lg-regular
              "
                style={{
                  fontSize: '20px',
                  lineHeight: 'var(--typography-line-height-body-lg)',
                  fontFamily: 'var(--typography-font-family-secondary)',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                  color: 'var(--typography-color-secondary-600)',
                }}
              >
                {faqItem.question}

                {/* Custom + / - icons */}
                <span className="ml-4 text-2xl leading-none accordion-icon">
                  {/* + when closed */}
                  <span className="material-symbols-outlined plus-icon">
                    add
                  </span>

                  {/* − when open */}
                  <span className="material-symbols-outlined minus-icon">
                    remove
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent
                className=""
                style={{
                  lineHeight: 'var(--typography-line-height-body-lg)',
                  fontSize: '16px',
                  fontFamily: 'var(--typography-font-family-secondary)',
                  color: 'var(--typography-color-secondary-800)',
                }}
              >
                {faqItem.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
