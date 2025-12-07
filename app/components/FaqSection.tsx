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
    <div className="flex flex-col section-wrapper gap-(--spacing-padding-8x)">
      <div className="flex flex-col gap-(--spacing-padding-3x) w-[50%]">
        <span className="text-md-regular text-(--typography-color-secondary-500)">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-(--typography-color-secondary-100)">
          Your Stay, Simplified
        </h2>
      </div>

      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          {List.items.map((faqItem, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-none group"
            >
              <AccordionTrigger
                className="
                flex justify-between text-left text-[20px] font-regular leading-body-lg font-secondary py-5 
                text-(--typography-color-secondary-600)
                no-underline hover:no-underline
                [&>svg]:hidden  /* <-- Hides default shadcn chevron */
                relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[#2B2B2B]
              "
              >
                {faqItem.question}

                {/* Custom + / - icons */}
                <span className="ml-4 text-2xl leading-none">
                  {/* + when closed */}
                  <span className="material-symbols-outlined group-data-[state=closed]:inline group-data-[state=open]:hidden">
                    add
                  </span>

                  {/* − when open */}
                  <span className="material-symbols-outlined group-data-[state=open]:inline group-data-[state=closed]:hidden">
                    remove
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent className="text-[16px] font-regular leading-body-lg font-secondary text-(--typography-color-secondary-800)">
                {faqItem.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
