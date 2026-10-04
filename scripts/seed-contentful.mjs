/**
 * Seeds the Contentful entries that HRI-22 and HRI-31 need.
 *
 * Both tickets are blocked on content existing, not on code: the blog listing
 * queries a `metadata` entry with slug `blogpage` that has never been created,
 * and the experiences section can only become CMS-driven once there are
 * entries to read. This creates and publishes them.
 *
 * Reuses the existing `contentsection` content type for experiences rather
 * than adding a new one — it already carries slug/eyebrow/title/description/
 * image, which is exactly an experience, and the space already uses it for
 * `curated-for-your-senses`.
 *
 * Usage:
 *   node scripts/seed-contentful.mjs              # dry run, prints the plan
 *   node scripts/seed-contentful.mjs --apply      # actually writes
 *   node scripts/seed-contentful.mjs --apply --only=metadata
 *
 * Idempotent: an entry whose slug already exists is left alone, so re-running
 * after adding photos or editing copy in the web app will not clobber them.
 *
 * Needs CONTENTFUL_MANAGEMENT_ACCESS_TOKEN in .env.local with content
 * management scope. The delivery token used by the site cannot write.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------------ config */

function loadEnv() {
  const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }

  return env;
}

const env = loadEnv();
const SPACE = env.CONTENTFULL_SPACE_ID;
const TOKEN = env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;
const ENVIRONMENT = 'master';
const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;

const APPLY = process.argv.includes('--apply');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').split(
  '='
)[1];

/* ------------------------------------------------------------------ content */

const BLOG_PAGE_METADATA = {
  slug: 'blogpage',
  title: 'Journal | Chembarathi Wayanad',
  description:
    'Stories from Chembarathi Wayanad — slow living, the surrounding forest and estate, and the experiences that shape a stay in the hills.',
};

/**
 * The eleven experiences from HRI-31.
 *
 * Where the site already had written copy (`app/experience/content.ts`) it is
 * reused verbatim so nothing regresses. The rest carry short, deliberately
 * non-specific descriptions — they make no claims about capacity, pricing or
 * facilities that could not be verified — and are meant to be edited in
 * Contentful before launch.
 */
const EXPERIENCES = [
  {
    slug: 'experience-forest-therapy',
    eyebrow: 'Renewal',
    title: 'Forest Therapy',
    description:
      "A guided walk through Wayanad's ancient canopy, where every step slows the mind and steadies the breath. Time softens here — leaves overhead, quiet trails underfoot — until the forest becomes less a place you walk through, and more a place that walks through you.",
    reused: true,
  },
  {
    slug: 'experience-nature-dining',
    eyebrow: 'Nourishment',
    title: 'Nature Dining',
    description:
      'Meals follow the land rather than a menu — organic, farm-fresh, and served wherever the evening feels right.',
    reused: true,
  },
  {
    slug: 'experience-guided-nature-walks',
    eyebrow: 'Discovery',
    title: 'Guided Nature Walks',
    description:
      'Unhurried walks across the estate with someone who knows it well — the trees, the birdcall, and what changes with the season.',
  },
  {
    slug: 'experience-dining-restaurant',
    eyebrow: 'The Table',
    title: 'Dining & Restaurant',
    description:
      'Kerala cooking and familiar comforts, prepared fresh through the day and served indoors or out.',
  },
  {
    slug: 'experience-wellness-spa',
    eyebrow: 'Restoration',
    title: 'Wellness & Spa',
    description:
      "Rooted in Kerala's centuries-old healing tradition, each treatment is prepared with warmth, care, and time-tested herbs. Here, restoration isn't rushed — it's a slow return to balance.",
    reused: true,
  },
  {
    slug: 'experience-offers-packages',
    eyebrow: 'Stay Longer',
    title: 'Offers & Packages',
    description:
      'Seasonal stays and curated packages, put together for the time of year you are visiting. Ask us what is running.',
  },
  {
    slug: 'experience-honeymoon-stays',
    eyebrow: 'For Two',
    title: 'Honeymoon Stays',
    description:
      'Private cottages, quiet mornings, and evenings arranged with a little more care — for the beginning of something.',
  },
  {
    slug: 'experience-family-stays',
    eyebrow: 'Together',
    title: 'Family Stays',
    description:
      'Room to spread out and slow down, with the forest as the thing everyone remembers.',
  },
  {
    slug: 'experience-private-pool-villa-stays',
    eyebrow: 'Seclusion',
    title: 'Private Pool Villa Stays',
    description:
      'Your own pool, your own view, and no reason to leave the villa until you feel like it.',
  },
  {
    slug: 'experience-weddings',
    eyebrow: 'Celebration',
    title: 'Weddings',
    description:
      'An intimate setting in the hills for the day itself and the days around it. Talk to us about what you have in mind.',
  },
  {
    slug: 'experience-corporate-retreats',
    eyebrow: 'Away Days',
    title: 'Corporate Retreats',
    description:
      'Somewhere genuinely removed from the office, for teams that need the distance to think.',
  },
];

/* ---------------------------------------------------------------- transport */

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...options.headers,
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = body?.message || body?.sys?.id || response.statusText;
    throw new Error(`${response.status} ${detail}`);
  }

  return body;
}

/** Contentful keys every field by locale, so the default has to be resolved. */
async function defaultLocale() {
  const { items } = await api('/locales');
  return (items.find(l => l.default) || items[0]).code;
}

async function findBySlug(contentType, slug) {
  const query = new URLSearchParams({
    content_type: contentType,
    'fields.slug': slug,
    limit: '1',
  });

  const { items } = await api(`/entries?${query}`);
  return items[0] || null;
}

async function createAndPublish(contentType, fields, locale) {
  const localised = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, { [locale]: value }])
  );

  const created = await api('/entries', {
    method: 'POST',
    headers: { 'X-Contentful-Content-Type': contentType },
    body: JSON.stringify({ fields: localised }),
  });

  return api(`/entries/${created.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(created.sys.version) },
  });
}

/* --------------------------------------------------------------------- run */

async function seed(label, contentType, records, locale) {
  console.log(`\n${label}`);

  let created = 0;
  let skipped = 0;

  for (const record of records) {
    // `reused` is a note for the plan output, not a Contentful field.
    const { reused, ...fields } = record;
    const existing = await findBySlug(contentType, fields.slug);

    if (existing) {
      console.log(`  skip    ${fields.slug} (already exists)`);
      skipped += 1;
      continue;
    }

    if (!APPLY) {
      console.log(
        `  create  ${fields.slug}${reused ? '  [reuses existing site copy]' : ''}`
      );
      created += 1;
      continue;
    }

    await createAndPublish(contentType, fields, locale);
    console.log(`  created ${fields.slug} and published`);
    created += 1;
  }

  console.log(`  → ${created} to create, ${skipped} already present`);
}

async function main() {
  if (!SPACE || !TOKEN) {
    console.error(
      'Missing CONTENTFULL_SPACE_ID or CONTENTFUL_MANAGEMENT_ACCESS_TOKEN in .env.local'
    );
    process.exit(1);
  }

  console.log(
    APPLY
      ? `Writing to space ${SPACE} (${ENVIRONMENT}).`
      : `DRY RUN against space ${SPACE} (${ENVIRONMENT}). Re-run with --apply to write.`
  );

  const locale = await defaultLocale();
  console.log(`Default locale: ${locale}`);

  if (!ONLY || ONLY === 'metadata') {
    await seed(
      'HRI-22 — blog listing metadata',
      'metadata',
      [BLOG_PAGE_METADATA],
      locale
    );
  }

  if (!ONLY || ONLY === 'experiences') {
    await seed(
      'HRI-31 — experiences (contentsection)',
      'contentsection',
      EXPERIENCES,
      locale
    );
  }

  console.log(
    '\nImages are not set: `contentsection.image` expects a Contentful asset,' +
      '\nso attach photos in the web app after seeding.'
  );
}

main().catch(error => {
  console.error(`\nFailed: ${error.message}`);
  if (/Access token invalid|AccessTokenInvalid/i.test(error.message)) {
    console.error(
      'The management token in .env.local is expired or lacks access.\n' +
        'Create a new one: Contentful → Settings → API keys → Content management tokens.'
    );
  }
  /* Set the code rather than calling `process.exit`, which tears Node down
     while the fetch handle is still closing and makes libuv print an
     assertion failure on Windows — alarming, and unrelated to the real error
     above it. */
  process.exitCode = 1;
});
