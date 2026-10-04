import { contentfulFetch } from '../API/Contentful/getContent';
import { experiencesQuery } from '../API/Query/query';
import type { ExperienceItemType } from './content';

/**
 * The experiences, from Contentful.
 *
 * Entries are `contentsection` records whose slug starts with `experience-`,
 * ordered by first publish. This is the only source — the bundled copy that
 * used to back this up has been removed now that the CMS holds all five.
 *
 * An entry missing a title or image is skipped rather than rendered as a
 * half-built panel. In practice that should not happen: `contentsection` marks
 * every field required, so an incomplete entry cannot be published in the first
 * place. The filter guards against a draft slipping through a preview token.
 */

type ExperienceEntry = {
  slug: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  image: {
    url: string;
    title: string | null;
    description: string | null;
  } | null;
};

type ExperienceCollection = {
  contentsectionCollection: { items: ExperienceEntry[] };
};

/** Contentful assets carry their own alt text; fall back to the title. */
function altFor(entry: ExperienceEntry): string {
  return (
    entry.image?.description?.trim() ||
    entry.image?.title?.trim() ||
    entry.title ||
    ''
  );
}

export async function getExperiences(): Promise<ExperienceItemType[]> {
  let items: ExperienceEntry[] = [];

  try {
    const data = await contentfulFetch<ExperienceCollection>(experiencesQuery);
    items = data?.contentsectionCollection?.items ?? [];
  } catch (error) {
    // Degrade to an empty list rather than taking the whole page down: the
    // hero and FAQ below still render, and ISR picks the panels up on the
    // next revalidation.
    console.error('Experiences: CMS query failed.', error);
    return [];
  }

  return items
    .filter(entry => entry.title && entry.image?.url)
    .map(entry => ({
      tag: entry.eyebrow ?? '',
      title: entry.title as string,
      description: entry.description ?? '',
      image: entry.image!.url,
      alt: altFor(entry),
    }));
}
