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
    }
    }
 }`,
  variables: {
    where: {
      slug: "home-page",
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
      slug: "homepage",
    },
  },
};
