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
        title
        img {
          url
        }
        description {
          contentList
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
