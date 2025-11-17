import { contentfulClient } from "../contentful";

export async function getHeroSection() {
  const res = await contentfulClient.getEntries({
    content_type: "hero",
  });

  return res;
}
