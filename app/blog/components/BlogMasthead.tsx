/**
 * Type-only opening for the listing. Deliberately has no hero image: the post
 * imagery starts a few hundred pixels below, and a banner here would compete
 * with it. Padding comes from the page's `section-wrapper`.
 */
export default function BlogMasthead({
  title,
  intro,
}: Readonly<{ title: string; intro: string }>) {
  return (
    <header className="flex flex-col gap-(--spacing-padding-6x) pb-(--spacing-padding-16x)! xs:!gap-(--spacing-padding-4x) xs:!pb-(--spacing-padding-10x)">
      <span className="text-md-regular uppercase text-(--typography-color-secondary-500)">
        Chembarathi Wayanad
      </span>

      <h1 className="max-w-[16ch] text-heading-1 text-(--typography-color-secondary-100) lg:!text-heading-2 xs:!text-heading-3">
        {title}
      </h1>

      <p className="max-w-[60ch] text-xl-regular text-(--typography-color-secondary-800) xs:!text-lg-regular">
        {intro}
      </p>
    </header>
  );
}
