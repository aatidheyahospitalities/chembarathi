import { commonSectionData } from "../lib/type";
import CommonLinkButton from "./CommonLinkButton";
import Image from "next/image";

export default async function commonSection({commonSectionData}: {commonSectionData: commonSectionData}) {

const title = commonSectionData?.fields.title || "";
const description = commonSectionData?.fields.description || "";
const ctaLabel = commonSectionData?.fields.ctaLabel || "";
// const ctaUrl = commonSectionData?.fields.ctaUrl || "";
const eyebrow = commonSectionData?.fields.eyebrow || "";
const image = `https:${commonSectionData?.fields.image?.fields?.file?.url || ""}`;

  return (
    <div className="p-huge-x gap-(--spacing-padding-16x) flex flex-col" >
        <div className="flex gap-(--spacing-padding-16x)">
            <div className="flex flex-col gap-(--spacing-padding-3x) w-[50%]">
              <span className="text-md-regular text-(--typography-color-secondary-500)">{eyebrow}</span>
              <h2 className="text-(--typography-color-secondary-100)">{title}</h2>
            </div>
            <div className="flex flex-col gap-(--spacing-padding-10x) w-[50%] text-start">
              <span className="text-xl-regular text-(--typography-color-secondary-800)">{description}</span>
              <CommonLinkButton text={ctaLabel}  />
            </div>
        </div>
        <div className="w-full h-[702px] flex relative">
          <Image src={image} alt="Common Section Image" className="object-cover" fill loading="eager"/>
        </div>
    </div>
  );
}
