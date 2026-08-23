export const homeContentQuery = {
  query: `
  query HomeCollection($where: PagetypeoneFilter) {
  pagetypeoneCollection(where: $where) {
    items {
    theexperiences {
        eyebrow
        title
        ctaLabel
        ctaUrl
        image {
        url
        }
        description
      contentTypeStyle
      showCtaLabel
    }
    aboutus {
        eyebrow
        title
        ctaLabel
        ctaUrl
        image {
        url
        }
        description
      contentTypeStyle
      showCtaLabel
    }
    experienceTheBeauty {
        eyebrow
        title
        description
        multipleimgCollection {
          items {
            url
          }
        }
      }
    hero {
        title
        slug
        image {
        url
        }
        description {
        json
        }
    }
    metadata {
        title
        description
    }
    title
      faq {
        faqItemCollection {
          items {
            answer
            question
          }
        }
      }
    }
    }
}`,
  variables: {
    where: {
      slug: 'home-page',
    },
  },
};

export const aboutContentQuery = {
  query: `
  query PageTypeTwo($where: PageTypeTwoFilter) {
  pageTypeTwoCollection(where: $where) {
    items {
      ecosystem {
        title
        showCtaLabel
        image {
          url
        }
        description
        eyebrow
        ctaUrl
        ctaLabel
        contentTypeStyle
      }
      connection {
        descriptionCollection {
          items {
            title
            img {
              url
            }
            description
          }
        }
      }
      awwwards {
        title
        showCtaLabel
        image {
          url
        }
        description
        eyebrow
        ctaUrl
        ctaLabel
        contentTypeStyle
      }
      faq {
        faqItemCollection {
          items {
            answer
            question
          }
        }
      }
    }
  }
}`,
  variables: {
    where: {
      slug: 'about-page',
    },
  },
};

export const homeMetaDataQuery = {
  query: `
  query MetadataCollection($where: MetadataFilter) {
  metadataCollection(where: $where) {
      items {
        title
        description
      }
    }
  }`,
  variables: {
    where: {
      slug: 'homepage',
    },
  },
};

export const aboutMetaDataQuery = {
  query: `
 query MetadataCollection($where: MetadataFilter) {
  metadataCollection(where: $where) {
      items {
        title
        description
      }
    }
  }`,
  variables: {
    where: {
      slug: 'aboutpage',
    },
  },
};

export const policyMetaDataQuery = {
  query: `
 query MetadataCollection($where: MetadataFilter) {
  metadataCollection(where: $where) {
      items {
        title
        description
      }
    }
  }`,
  variables: {
    where: {
      slug: 'policypage',
    },
  },
};

export const policyContentQuery = {
  query: `
  query PolicypageCollection($where: PolicypageFilter) {
  policypageCollection(where: $where) {
    items {
      policy {
        policyblockCollection {
          items {
            heading
            name
            content
          }
        }
      }
    }
  }
}
`,
  variables: {
    where: {
      slug: 'policypage',
    },
  },
};

/* ── Blog ──────────────────────────────────────────────────────────────────
   The listing pages through `blogPostCollection` newest-first. `total` comes
   back with every page so the Load More button knows when to retire. */

const BLOG_POST_CARD_FIELDS = `
  title
  slug
  date
  coverImage {
    url
    title
    description
    width
    height
  }
`;

export const blogMetaDataQuery = {
  query: `
 query MetadataCollection($where: MetadataFilter) {
  metadataCollection(where: $where) {
      items {
        title
        description
      }
    }
  }`,
  variables: {
    where: {
      slug: 'blogpage',
    },
  },
};

export const blogListQuery = (limit: number, skip: number) => ({
  query: `
  query BlogPostCollection($limit: Int!, $skip: Int!) {
  blogPostCollection(limit: $limit, skip: $skip, order: date_DESC) {
    total
    items {
      ${BLOG_POST_CARD_FIELDS}
    }
  }
}
`,
  variables: { limit, skip },
});

/** Every slug, for `generateStaticParams`. */
export const blogSlugsQuery = {
  query: `
  query BlogPostCollection {
  blogPostCollection(limit: 200, order: date_DESC) {
    items {
      slug
    }
  }
}
`,
};

export const blogPostQuery = (slug: string) => ({
  query: `
  query BlogPostCollection($where: BlogPostFilter) {
  blogPostCollection(where: $where, limit: 1) {
    items {
      ${BLOG_POST_CARD_FIELDS}
      heading
      content {
        json
        links {
          assets {
            block {
              sys {
                id
              }
              url
              title
              description
              width
              height
            }
          }
        }
      }
      metaData {
        # The reference accepts any entry type, so GraphQL exposes it as the
        # generic Entry interface. The fragment stays valid either way if a
        # "Meta Data only" validation is added later.
        ... on Metadata {
          title
          description
        }
      }
    }
  }
}
`,
  variables: {
    where: { slug },
  },
});

/** Newest posts other than the one being read. Over-fetches by one so the
    caller always has four to show. */
export const relatedBlogPostsQuery = (slug: string) => ({
  query: `
  query BlogPostCollection($where: BlogPostFilter) {
  blogPostCollection(where: $where, limit: 5, order: date_DESC) {
    items {
      ${BLOG_POST_CARD_FIELDS}
    }
  }
}
`,
  variables: {
    where: { slug_not: slug },
  },
});
